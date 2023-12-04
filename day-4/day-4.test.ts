import { expect, test } from "bun:test";
import {
  getCardData,
  getWinningNumbers,
  part1,
  part2,
  totalWinningNumbers,
} from ".";

const example = `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`;

const firstLineData = {
  card: 1,
  numbers: [41, 48, 83, 86, 17],
  winning_numbers: [83, 86, 6, 31, 17, 9, 48, 53],
};

test("get card data", () => {
  const data = getCardData(`Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53`);

  expect(data).toStrictEqual(firstLineData);
});

test("part 1", () => {
  expect(part1(example)).toBe(13);
});

test("part 2", () => {
  expect(part2(example)).toBe(30);
});

test("get winning numbers", () => {
  expect(
    getWinningNumbers(
      firstLineData.winning_numbers,
      firstLineData.numbers
    ).sort()
  ).toEqual([48, 83, 17, 86].sort());
});

test("total winning numbers", () => {
  expect(totalWinningNumbers(4)).toBe(8);
});
