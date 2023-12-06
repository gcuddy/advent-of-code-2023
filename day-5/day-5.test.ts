import { expect, test } from "bun:test";
import {
  find_smallest_output,
  parse_map,
  parse_numbers,
  part1,
  part2,
  process_range,
} from ".";

test("part 1", async () => {
  const f = Bun.file("./example.txt");
  const input = await f.text();
  expect(part1(input)).toBe(35);
});

test("part 2", async () => {
  const f = Bun.file("./example.txt");
  const input = await f.text();
  expect(part2(input)).toBe(46);
});

test("get seeds", () => {
  expect(parse_numbers(`seeds: 79 14 55 13`)).toEqual([79, 14, 55, 13]);
});

// test("smallest output", () => {
//   const lines = `50 98 2
//     52 50 48`;
//   const l = parse_map(lines.split("\n"));
//   const range = [79, 92] as const;
//   expect(find_smallest_output(l, range)).toBe(82);
// });

test("range processing: seed-to-soil", () => {
  expect(
    process_range(
      [[79, 92]],
      [
        {
          start: 50,
          end: 97,
          offset: 2,
        },
        {
          start: 98,
          end: 99,
          offset: -48,
        },
      ]
    )
  ).toEqual([[81, 94]]);
});

test("range processing: seed-to-soil (2)", () => {
  expect(
    process_range(
      [[55, 67]],
      [
        {
          start: 50,
          end: 97,
          offset: 2,
        },
        {
          start: 98,
          end: 99,
          offset: -48,
        },
      ]
    )
  ).toEqual([[57, 69]]);
});

test("range processing: soil to fertilizer", () => {
  expect(
    process_range(
      [[81, 94]],
      [
        {
          start: 15,
          end: 51,
          offset: -15,
        },
        {
          start: 52,
          end: 53,
          offset: -15,
        },
        {
          start: 0,
          end: 14,
          offset: 39,
        },
      ]
    )
  ).toEqual([[81, 94]]);
});
test("range processing: soil to fertilizer (2)", () => {
  expect(
    process_range(
      [[57, 69]],
      [
        {
          start: 15,
          end: 51,
          offset: -15,
        },
        {
          start: 52,
          end: 53,
          offset: -15,
        },
        {
          start: 0,
          end: 14,
          offset: 39,
        },
      ]
    )
  ).toEqual([[57, 69]]);
});

test("range processing: fertilizer-to-water (2)", () => {
  expect(
    process_range(
      [[57, 69]],
      [
        {
          start: 53,
          end: 60,
          offset: -4,
        },
        {
          start: 11,
          end: 52,
          offset: -11,
        },
        {
          start: 0,
          end: 6,
          offset: 42,
        },
        {
          start: 7,
          end: 10,
          offset: 50,
        },
      ]
    )
  ).toEqual([
    // 57, 60
    [53, 56],
    [61, 69],
  ]);
});

test("range processing: fertilizer-to-water", () => {
  expect(
    process_range(
      [[81, 94]],
      [
        {
          start: 53,
          end: 60,
          offset: -4,
        },
        {
          start: 11,
          end: 52,
          offset: -11,
        },
        {
          start: 0,
          end: 6,
          offset: 42,
        },
        {
          start: 7,
          end: 10,
          offset: 50,
        },
      ]
    )
  ).toEqual([[81, 94]]);
});

test("range processing: water-to-light", () => {
  expect(
    process_range(
      [[81, 94]],
      [
        {
          start: 18,
          end: 24,
          offset: 70,
        },
        {
          start: 25,
          end: 94,
          offset: -7,
        },
      ]
    )
  ).toEqual([[74, 87]]);
});

test("range processing: light-to-temperature", () => {
  expect(
    process_range(
      [[74, 87]],
      [
        {
          start: 77,
          end: 99,
          offset: -32,
        },
        {
          start: 45,
          end: 63,
          offset: 36,
        },
        {
          start: 64,
          end: 76,
          offset: 4,
        },
      ]
    )
  ).toEqual([
    [45, 55],
    [78, 80],
  ]);
});

test("range processing: temperature-to-humidity", () => {
  expect(
    process_range(
      [
        [45, 55],
        [78, 80],
      ],
      [
        {
          start: 69,
          end: 69,
          offset: -69,
        },
        {
          start: 0,
          end: 68,
          offset: 1,
        },
      ]
    )
  ).toEqual([
    [46, 56],
    [78, 80],
  ]);
});

test("range processing: humidity-to-location", () => {
  expect(
    process_range(
      [
        [46, 56],
        [78, 80],
      ],
      [
        {
          start: 56,
          end: 92,
          offset: 4,
        },
        {
          start: 93,
          end: 96,
          offset: -37,
        },
      ]
    )
  ).toEqual([
    // [56, 56],
    [60, 60],
    [46, 55],
    [82, 84],
  ]);
});
