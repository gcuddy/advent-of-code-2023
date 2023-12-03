import { expect, test } from "vitest";

import { in_range, part_2 } from "./day-3";

test("1.txt", async () => {
  expect(await part_2("./test-cases/1.txt")).toBe(892_515);
});

test("2.txt", async () => {
  expect(await part_2("./test-cases/2.txt")).toBe(492);
});

test("3.txt", async () => {
  expect(await part_2("./test-cases/3.txt")).toBe(1_222_664);
});

test("sample", async () => {
  expect(await part_2("./sample.txt")).toBe(467835);
});

test("in_range", () => {
  expect(in_range(0, 4, 1, 2, 3, 4, 5)).toBe(true);
});

test("in_range", () => {
  expect(in_range(0, 4, 5)).toBe(false);
});
