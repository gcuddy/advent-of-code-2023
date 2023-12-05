import { expect, test } from "bun:test";
import { parse_numbers, part1 } from ".";

test("part 1", async () => {
  const f = Bun.file("./example.txt");
  const input = await f.text();
  expect(part1(input)).toBe(35);
});

test("get seeds", () => {
  expect(parse_numbers(`seeds: 79 14 55 13`)).toEqual([79, 14, 55, 13]);
});
