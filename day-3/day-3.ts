const digit_regex = /(\d+)/g;
const symbol_regex = /[^\.\d\sa-zA-Z]/;
const directions = ["n", "e", "s", "w"] as const;
// const directions = ["n", "ne", "e", "se", "s", "sw", "w", "nw"] as const;

async function part_1(path: string) {
  const file = Bun.file(path);

  const text = await file.text();

  const rows = text.split("\n");

  const rowLength = rows[0].length;

  const total = rows.reduce((acc, row, rowIndex) => {
    const matches = Array.from(row.matchAll(digit_regex));
    const sum = matches.reduce((acc, matchArr) => {
      const startIndex = matchArr.index;
      if (startIndex === undefined) return acc;
      const endIndex = startIndex + matchArr[0].length;

      const indices = [
        Math.max(startIndex - 1, 0),
        Math.min(endIndex, rowLength - 1),
      ] as const;

      let isPart = false;
      let directionIndex = 0;
      //   could refactor to use array.some
      while (!isPart && directionIndex < directions.length) {
        const d = directions[directionIndex];
        switch (d) {
          case "n": {
            if (rowIndex === 0) {
              break;
            }
            // look in row above
            const previousRow = rows[rowIndex - 1];
            // Was doing ...indices before, but indices goes up to (not including) end index. So have to add 1. Kind of awkward
            const areaToCheck = previousRow.slice(indices[0], indices[1] + 1);
            if (symbol_regex.test(areaToCheck)) {
              isPart = true;
              break;
            }
          }
          case "e": {
            // check right before
            if (startIndex === 0) {
              break;
            }

            if (symbol_regex.test(row[indices[0]])) {
              isPart = true;
              break;
            }
          }
          case "s": {
            if (rowIndex === rows.length - 1) {
              break;
            }
            // look in row below
            const nextRow = rows[rowIndex + 1];
            const areaToCheck = nextRow.slice(indices[0], indices[1] + 1);
            if (symbol_regex.test(areaToCheck)) {
              isPart = true;
              break;
            }
          }
          case "w": {
            // check right after
            if (endIndex === row.length - 1) {
              break;
            }
            if (symbol_regex.test(row[indices[1]])) {
              isPart = true;
              break;
            }
          }
        }
        directionIndex++;
      }

      if (isPart) {
        // console.log(`${matchArr[0]} in row ${rowIndex} is a part`);
        return acc + +matchArr[0];
      }

      return acc;
    }, 0);

    return acc + sum;
  }, 0);

  console.log(total);
}

const gear_regex = /\*/g;

type Row = number;

export function in_range(start: number, end: number, ...nums: number[]) {
  for (let i = start; i <= end; i++) {
    if (nums.includes(i)) return true;
  }
  return false;
}

export async function part_2(path: string) {
  const file = Bun.file(path);
  const text = await file.text();
  const rows = text.split("\n");
  console.log({ rows });
  const rowLength = rows[0].length;

  //   this is probably not the best structure
  const digitMap = new Map<
    Row,
    Array<{
      digit: number;
      range: Readonly<[number, number]>;
    }>
  >();

  const getOrSetDigitsForRow = (row: number) => {
    const existing = digitMap.get(row);
    if (existing) return existing;
    const digits = Array.from(rows[row].matchAll(digit_regex)).map((r) => {
      return {
        digit: +r[0],
        range: [r.index ?? 0, (r.index ?? 0) + r[0].length - 1],
      } as const;
    });
    digitMap.set(row, digits);
    return digits;
  };

  const total = rows.reduce((acc, row, rowIndex) => {
    const matches = Array.from(row.matchAll(gear_regex));
    if (!matches.length) return acc;

    let digits = getOrSetDigitsForRow(rowIndex);

    const sum = matches.reduce((acc, matchArr) => {
      const { index } = matchArr;
      if (index === undefined) return acc;
      console.log(`Examining index ${matchArr.index} of row ${rowIndex}`);
      const indices = [
        Math.max(0, index - 1),
        Math.min(rowLength - 1, index + 1),
      ] as const;
      console.log({ indices });

      let parts: number[] = [];
      let directionIndex = 0;
      //   could refactor to use array.some
      while (directionIndex < directions.length) {
        const d = directions[directionIndex];
        switch (d) {
          case "n": {
            if (rowIndex === 0) {
              break;
            }
            // look in row above
            const previousRowDigits = getOrSetDigitsForRow(rowIndex - 1);
            // console.log({ previousRowDigits });
            for (const m of previousRowDigits) {
              if (in_range(indices[0], indices[1], ...m.range))
                parts.push(m.digit);
            }

            break;
          }
          case "e": {
            // check right before
            if (index === row.length - 1) {
              break;
            }

            if (rowIndex === 1) {
              //   console.log(indices, digits);
            }

            const d = digits.find((d) => d.range[0] === indices[1]);

            if (d) {
              parts.push(d.digit);
            }
            break;
          }
          case "s": {
            if (rowIndex === rows.length - 1) {
              break;
            }

            const nextRowDigits = getOrSetDigitsForRow(rowIndex + 1);

            for (const m of nextRowDigits) {
              if (in_range(indices[0], indices[1] + 1, ...m.range))
                parts.push(m.digit);
              //   if (m.range[1] >= indices[0] || m.range[0] <= indices[1] + 1) {
              //     parts.push(m.digit);
              //   }
            }

            break;
          }
          case "w": {
            // check right before
            if (index === 0) {
              break;
            }
            const d = digits.find((d) => d.range[1] === indices[0]);

            if (d) {
              parts.push(d.digit);
            }
          }
        }
        directionIndex++;
      }

      console.log({ parts });
      if (rowIndex === 1) {
        // console.log({ parts, pos: matchArr.index });
      }
      // console.log({
      //   parts,
      //   rows: [rows[rowIndex - 1], row, rows[rowIndex + 1]],
      // });

      if (parts.length === 2) {
        // console.log({ parts });
        // console.log(
        //   `${matchArr[0]} at index ${matchArr.index} in row ${rowIndex} is a part`
        // );
        const power = parts[0] * parts[1];
        return acc + power;
      }

      return acc;
    }, 0);

    return acc + sum;
  }, 0);

  console.log(total);
  return total;
}

// await part_1("./input.txt");
// await part_2("./sample.txt");
await part_2("./input.txt");

[""];
