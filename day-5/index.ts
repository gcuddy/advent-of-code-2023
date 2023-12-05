const num_regex = /(\d+)/g;
const map_regex = /\w.*?map\:/g;

// q: is there a way to map the maps semantically? instead of just following procedurally i.e. going map a -> b -> c ... f (and then proclaiming a -> f)
export function part1(input: string): number {
  const locations: number[] = [];
  const lines = input.split("\n");
  const seeds = parse_numbers(lines[0]);
  const maps = lines.slice(2).join("\n").split(map_regex).slice(1);
  console.log({ seeds, maps });
  for (const seed of seeds) {
    let curr = seed;
    // is there a way to avoid this n^2?
    console.log({ curr });
    for (const map of maps) {
      console.log(`first map`, map);
      const m = parse_map(map.split("\n"));
      console.log({ m });
      curr = lookup(m, curr);
    }
    // console.log(seed);
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

export function parse_numbers(line: string): number[] {
  return Array.from(line.matchAll(num_regex)).map((n) => +n[0]);
}

const lookup = (map: Map<number, number>, n: number) => map.get(n) ?? n;

export function parse_map(lines: string[]) {
  // source -> dest
  const map = new Map<number, number>();
  // dest, source, range
  console.log("parsing map", lines);
  lines.forEach((line) => {
    // protect against empty lines
    if (!line.trim()) return;
    const [d, s, r] = parse_numbers(line);
    console.log({ d, s, r });
    for (let i = 0; i < r; i++) {
      map.set(s + i, d + i);
    }
  });
  return map;
}

async function input() {
  const [path] = Bun.argv.slice(2);
  if (!path) return;
  const f = Bun.file(path);

  const input = await f.text();

  //   console.log({ input });
  console.log("part 1: ", part1(input));
  //   console.log("part 2:", part2(input));
}

input();
