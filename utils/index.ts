const num_regex = /(\d+)/g;
export function parse_numbers(line: string): number[] {
  return Array.from(line.matchAll(num_regex)).map((n) => +n[0]);
}
