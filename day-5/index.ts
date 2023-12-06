const num_regex = /(\d+)/g;
const map_regex = /\w.*?map\:/g;

// (part 1 iteration)
type MapLine = {
  source: number;
  dest: number;
  range: number;
};

// (part 2 types)
// use this for rules
type Range = {
  start: number;
  end: number;
  offset: number;
};

// use this to track seed range over time
type SRange = [number, number];
type SeedRanges = SRange[];

// utils

function chunk<T>(a: T[], c: number) {
  if (c < 1) return [];
  const r = [];
  let i = 0;
  const l = a.length;
  while (i < l) {
    r.push(a.slice(i, (i += c)));
  }
  return r;
}

export function parse_numbers(line: string): number[] {
  return Array.from(line.matchAll(num_regex)).map((n) => +n[0]);
}

export function get_lowest_from_sranges(sranges: SRange[]) {
  return Math.min(...sranges.map((s) => s[0]));
}

// (part 2)
export function parse_seed_range(line: string): SeedRanges {
  const nums = parse_numbers(line);
  const chunks = chunk(nums, 2);
  return chunks.map((s) => [s[0], s[0] + s[1] - 1] satisfies SRange);
}

// (part 1)
const lookup_line = (lines: MapLine[], n: number) => {
  // if n is within source mapping, then get destination mapping. else return n
  for (const line of lines) {
    const { dest, range, source } = line;
    const offset = dest - source;
    if (n >= source && n <= source + range - 1) {
      return n + offset;
    }
  }
  return n;
};

// (part 2)
export function process_range(
  existing_ranges: SeedRanges,
  ranges: Range[]
): SeedRanges {
  const new_ranges: SeedRanges = [];
  for (const er of existing_ranges) {
    let has_match = false;
    for (const range of ranges) {
      // This code doesn't seem like it should work, but it does...
      // I need to clean it up to remove extraneous logic that's not doing anything, but I'm afraid to touch it!!
      if (er[0] >= range.start && range.end >= er[0] && range.end < er[1]) {
        // then we have a split...
        const n = [er[0] + range.offset, range.end + range.offset] as SRange;
        er[0] = range.end + 1;
        // This line works for all the inputs, but I think I'm missing a piece of logic here. Anyway, it works.
        existing_ranges.push([range.end + 1, er[1]] as SRange);
        new_ranges.push(n);
        has_match = true;
      } else if (er[0] >= range.start && er[1] <= range.end) {
        // then we're in the range
        new_ranges.push([er[0] + range.offset, er[1] + range.offset]);
        has_match = true;
      } else if (er[1] <= range.end && range.start <= er[1]) {
        const n: SRange = [range.start + range.offset, er[1] + range.offset];
        er[1] = range.start - 1;
        new_ranges.push(n);
      }
    }
    if (!has_match) {
      new_ranges.push(er);
    }
  }

  return new_ranges;
}

// (part 1)
export function parse_map(lines: string[]): Array<MapLine> {
  return lines
    .map((line) => {
      // protect against empty lines
      if (!line.trim()) return;
      const [dest, source, range] = parse_numbers(line);
      return {
        dest,
        source,
        range,
      };
    })
    .filter(Boolean) as Array<MapLine>;
}

// (part 2)
export function map_to_range(lines: string[]): Array<Range> {
  return lines
    .map((line) => {
      // protect against empty lines
      if (!line.trim()) return;
      const [dest, source, range] = parse_numbers(line);
      return {
        start: source,
        end: source + range - 1,
        offset: dest - source,
      };
    })
    .filter(Boolean);
}

export function part1(input: string): number {
  const locations: number[] = [];
  const lines = input.split("\n");
  const seeds = parse_numbers(lines[0]);
  const maps = lines.slice(2).join("\n").split(map_regex).slice(1);
  for (const seed of seeds) {
    let curr = seed;
    for (const map of maps) {
      const m = parse_map(map.split("\n"));
      curr = lookup_line(m, curr);
    }
    locations.push(curr);
  }

  return Math.min(...locations);
}

export function part2(input: string): number {
  const lines = input.split("\n");
  const seeds = parse_seed_range(lines[0]);
  const maps = lines.slice(2).join("\n").split(map_regex).slice(1);

  const ranges = maps.map((m) => map_to_range(m.split("\n")));

  const lows: number[] = [];
  for (const sr of seeds) {
    let initial = [sr];
    for (const r of ranges) {
      initial = process_range(initial, r);
    }
    lows.push(get_lowest_from_sranges(initial));
  }
  return Math.min(...lows);
}

async function input() {
  const [path] = Bun.argv.slice(2);
  if (!path) return;
  const f = Bun.file(path);

  const input = await f.text();
  console.log("part 1: ", part1(input));
  console.log("part 2: ", part2(input));
}

input();
