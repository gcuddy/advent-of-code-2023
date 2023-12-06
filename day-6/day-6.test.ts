import { describe, expect, test } from "bun:test";
import { get_record_beaters, parse_races, part1, part2 } from ".";

const example = `Time:      7  15   30
Distance:  9  40  200`;

describe("parts", () => {
  test("part 1", () => {
    expect(part1(example)).toBe(288);
  });
  test("part 2", () => {
    expect(part2(example)).toBe(71503);
  });
});

test("parse races", () => {
  expect(parse_races(example)).toEqual([
    {
      time: 7,
      record: 9,
    },
    {
      time: 15,
      record: 40,
    },
    {
      time: 30,
      record: 200,
    },
  ]);
});

test("record beaters", () => {
  expect(
    get_record_beaters({
      time: 7,
      record: 9,
    })
  ).toBe(4);
});
