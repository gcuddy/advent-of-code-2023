import { expect, test } from "bun:test";
import { parse_numbers } from ".";

test("parse numbers from line", () => {
  expect(parse_numbers("1 43    98 hello 421")).toEqual([1, 43, 98, 421]);
});
