import { expect, test } from "vitest";
import {
  getDigitIndexes,
  getGearIndexes,
  getSurroundingDigits,
} from "./day-3-take-2";

export const sample = `467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`;

test("getGearIndexes", () => {
  expect(getGearIndexes(`...$.*....`)).toStrictEqual([5]);
});

test("getDigitIndexes", () => {
  expect(getDigitIndexes(`......755.`)).toStrictEqual([
    {
      digit: 755,
      range: [6, 8],
    },
  ]);
  expect(getDigitIndexes(`.664.598..`)).toStrictEqual([
    {
      digit: 664,
      range: [1, 3],
    },
    {
      digit: 598,
      range: [5, 7],
    },
  ]);
});

test("get surrounding squares", () => {
  const split = sample.split("\n");
  const digitIndexes = split.map((s) => getDigitIndexes(s));
  const gearIndexes = getGearIndexes(split[1]);
  expect(
    getSurroundingDigits(split, digitIndexes, 1, gearIndexes[0]).sort()
  ).toStrictEqual([35, 467]);
});

test("part1", () => {});
