const num_regex = /(\d+)/g;
const map_regex = /\w.*?map\:/g;

type MapLine = {
  source: number;
  dest: number;
  range: number;
};

// q: is there a way to map the maps semantically? instead of just following procedurally i.e. going map a -> b -> c ... f (and then proclaiming a -> f)
export function part1(input: string): number {
  const locations: number[] = [];
  const lines = input.split("\n");
  const seeds = parse_numbers(lines[0]);
  const maps = lines.slice(2).join("\n").split(map_regex).slice(1);
  for (const seed of seeds) {
    let curr = seed;
    // is there a way to avoid this n^2?
    for (const map of maps) {
      const m = parse_map(map.split("\n"));
      curr = lookup_line(m, curr);
    }
    locations.push(curr);
  }

  return Math.min(...locations);
}

function run_seed_thru_map() {}

// need some way of calculating a -> f

export function get_lowest_from_sranges(sranges: SRange[]) {
  return Math.min(...sranges.map((s) => s[0]));
}

export function part2(input: string): number {
  const locations: number[] = [];
  const lines = input.split("\n");
  const seeds = parse_seed_range(lines[0]);
  const maps = lines.slice(2).join("\n").split(map_regex).slice(1);

  const ranges = maps.map((m) => map_to_range(m.split("\n")));

  const [test_seed] = seeds;

  let initial = [test_seed];
  for (const r of ranges) {
    initial = process_range(initial, r);
  }
  //   console.log({ seeds, ranges });

  //   TODO: there's probably a way to cache/be smarter about seeds so we don't reprocess everything
  //   for (const seed of seeds) {
  //     let curr = seed;
  //     // is there a way to avoid this n^2?
  //     for (const map of maps) {
  //       const m = parse_map(map.split("\n"));
  //       // now this should be a "find smallest" type thing
  //       curr = lookup_line(m, curr);
  //     }
  //     locations.push(curr);
  //   }

  console.log({ initial });

  return get_lowest_from_sranges(initial);
}

// move to utils - also, this seems useful but won't actually be useful for the real inputs (which have millions of numbers - this will slow to a stop)
export function range(start: number, end: number) {
  const output: number[] = [];
  for (let i = start; i < end; i++) {
    output.push(i);
  }
  return output;
}

function chunk<T>(a: T[], c: number) {
  if (c < 1) return [];
  const r = [];
  let i = 0;
  let l = a.length;
  while (i < l) {
    r.push(a.slice(i, (i += c)));
  }
  return r;
}

// lol: this works great in the example, but the actual input won't work because they're million of items
export function parse_seed_range(line: string): SeedRanges {
  const nums = parse_numbers(line);
  const chunks = chunk(nums, 2);
  return chunks.map((s) => [s[0], s[0] + s[1] - 1] satisfies SRange);
}

export function parse_numbers(line: string): number[] {
  return Array.from(line.matchAll(num_regex)).map((n) => +n[0]);
}

const lookup = (map: Map<number, number>, n: number) => map.get(n) ?? n;

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

// use this for rules
type Range = {
  start: number;
  end: number;
  offset: number;
};

// use this to track seed range over time
type SRange = [number, number];
type SeedRanges = SRange[];

export function process_range(
  existing_ranges: SeedRanges,
  ranges: Range[]
): SeedRanges {
  const new_ranges: SeedRanges = [];
  for (let er of existing_ranges) {
    let has_match = false;
    for (const range of ranges) {
      if (er[0] >= range.start && range.end >= er[0] && range.end < er[1]) {
        // then we have a split...
        // console.log("SPLIT!!!", er, range);
        const n = [er[0] + range.offset, range.end + range.offset] as SRange;
        er[0] = range.end + 1;
        new_ranges.push(n);
        has_match = true;
        //   console.log(`now: `, er, range)
      } else if (er[0] >= range.start && er[1] <= range.end) {
        // then we're in the range
        new_ranges.push([er[0] + range.offset, er[1] + range.offset]);
        has_match = true;
      } else if (er[1] <= range.end && range.start <= er[1]) {
        // console.log("END SPLIT!!!", er, range);
        const n: SRange = [range.start + range.offset, er[1] + range.offset];
        // new_ranges.push([])
        er[1] = range.start - 1;
        new_ranges.push(n);
        // has_match = true;
      }
    }
    if (!has_match) {
      new_ranges.push(er);
    }
  }
  //   for (const range of ranges) {
  //     for (const er of existing_ranges) {
  //       if (er[0] >= range.start && er[1] <= range.end) {
  //         // then we're in the range
  //         new_ranges.push([er[0] + range.offset, er[1] + range.offset]);
  //       } else {
  //         new_ranges.push(er);
  //       }
  //     }
  //   }

  //   console.log({ new_ranges });
  return new_ranges;
}

/**
 * Given a range, this should find the smallest output somehow
 */
export function find_smallest_output(
  lines: MapLine[],
  n_range: Readonly<[number, number]>
) {
  // each line goes: [source, source + range] -> [dest, dest + range]
  // given 79 - 92, we should check if the destination is higher or lower than the source (offset).
  // if higher, then we want to avoid it. if lower, we want to seek it out.
  //
  let curr_smallest: [number, number] = [-1, -1];
  for (const line of lines) {
    const { dest, range, source } = line;
    const offset = dest - source;
    if (offset > 0) {
      // destination -s higher
      if (n_range[0] < source) {
      }
    } else {
    }
    // if (n >= source && n <= source + range - 1) {
    //   return n + offset;
    // }
  }
  return n;
}

// find smallest

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

async function input() {
  const [path] = Bun.argv.slice(2);
  if (!path) return;
  const f = Bun.file(path);

  const input = await f.text();
  console.log("part 1: ", part1(input));
  console.log("part 2: ", part2(input));
}

input();
