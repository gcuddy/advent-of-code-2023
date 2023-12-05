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

export function part2(input: string): number {
  const locations: number[] = [];
  const lines = input.split("\n");
  const seeds = parse_seed_range(lines[0]);
  console.log({ seeds });
  const maps = lines.slice(2).join("\n").split(map_regex).slice(1);
  //   TODO: there's probably a way to cache/be smarter about seeds so we don't reprocess everything
  for (const seed of seeds) {
    let curr = seed;
    // is there a way to avoid this n^2?
    for (const map of maps) {
      const m = parse_map(map.split("\n"));
      // now this should be a "find smallest" type thing
      curr = lookup_line(m, curr);
    }
    locations.push(curr);
  }

  return Math.min(...locations);
}

// move to utils
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
export function parse_seed_range(line: string) {
  const nums = parse_numbers(line);
  const chunks = chunk(nums, 2);
  console.log({ chunks });
  const seeds = chunks.flatMap((c) => range(c[0], c[0] + c[1]));
  console.log({ seeds });
  return seeds;
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

async function input() {
  const [path] = Bun.argv.slice(2);
  if (!path) return;
  const f = Bun.file(path);

  const input = await f.text();
  console.log("part 1: ", part1(input));
  console.log("part 2: ", part2(input));
}

input();
