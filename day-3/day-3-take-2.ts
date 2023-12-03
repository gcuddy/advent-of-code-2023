type DigitInfo = { digit: number; range: Readonly<[number, number]> };

const gear_regex = /\*/g;
const digit_regex = /(\d+)/g;

export function getGearIndexes(line: string): number[] {
  const matches = Array.from(line.matchAll(gear_regex));

  return matches.map((m) => m.index).filter(Boolean) as number[];
}

export function getDigitIndexes(row: string): Array<DigitInfo> {
  return Array.from(row.matchAll(digit_regex)).map((m) => {
    return {
      digit: +m[0],
      range: [m.index ?? 0, (m.index ?? 0) + m[0].length - 1],
    };
  });
}

export function getSurroundingDigits(
  rows: string[],
  digitIndexes: Array<Array<DigitInfo>>,
  row: number,
  column: number
): Array<number> {
  const s = new Set<number>();

  const colStart = Math.max(column - 1, 0);
  const colEnd = Math.min(column + 1, rows[0].length);

  if (row > 0) {
    // look above
    const dr = digitIndexes[row - 1];
    for (let i = colStart; i <= colEnd; i++) {
      for (const d of dr) {
        if (d.range.includes(i)) {
          s.add(d.digit);
        }
      }
    }
  }
  if (row < rows.length - 1) {
    // look below
    const dr = digitIndexes[row + 1];
    for (let i = colStart; i <= colEnd; i++) {
      for (const d of dr) {
        if (d.range.includes(i)) {
          s.add(d.digit);
        }
      }
    }
  }

  const dr = digitIndexes[row];
  if (column > 0) {
    // look left
    for (const d of dr) {
      if (d.range[1] === column - 1) {
        s.add(d.digit);
      }
    }
  }
  if (column < rows[0].length - 1) {
    // look right
    for (const d of dr) {
      if (d.range[0] === column + 1) {
        s.add(d.digit);
      }
    }
  }

  return Array.from(s);
}

function part2(text: string) {
  const rows = text.split("\n");
  const digitIndexes = rows.map((s) => getDigitIndexes(s));

  const ratios: number[] = [];
  let rowIndex = 0;
  for (const row of rows) {
    const gears = getGearIndexes(row);

    for (const gear of gears) {
      const nums = getSurroundingDigits(rows, digitIndexes, rowIndex, gear);
      if (nums.length === 2) ratios.push(nums[0] * nums[1]);
    }

    rowIndex++;
  }

  const sum = ratios.reduce((acc, curr) => acc + curr, 0);

  console.log(sum);
  return sum;
}

const str = await Bun.file("./input.txt").text();

part2(str);
