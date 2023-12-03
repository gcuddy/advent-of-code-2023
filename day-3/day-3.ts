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

async function part_2(path: string) {
  const file = Bun.file(path);
  const text = await file.text();
  const rows = text.split("\n");
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
        range: [r.index ?? 0, r.index ?? 0 + r[0].length],
      } as const;
    });
    digitMap.set(row, digits);
  };

  const total = rows.reduce((acc, row, rowIndex) => {
    const matches = Array.from(row.matchAll(gear_regex));
    if (!matches.length) return acc;

    let digits = getOrSetDigitsForRow(rowIndex);

    const sum = matches.reduce((acc, matchArr) => {
      const { index } = matchArr;
      if (index === undefined) return acc;
      const indices = [
        Math.max(0, index - 1),
        Math.min(rowLength - 1, index + 1),
      ];

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
            const previousRow = rows[rowIndex - 1];

            // find digit
            // TODO: new approach: store previous row's digits, and check if those digits fall within index matrix

            // Was doing ...indices before, but indices goes up to (not including) end index. So have to add 1. Kind of awkward
            const areaToCheck = previousRow.slice(indices[0], indices[1] + 1);
            console.log({ areaToCheck });
            const m = areaToCheck.match(digit_regex);
            console.log({ m, index: m?.index });
            if (m?.index !== undefined) {
              //   then we've got to check around the digit, so help me god there is a better way to do this that has better memory usage
              const actualIndex = indices[0] + m.index;
              console.log({ actualIndex });

              const prefix: string[] = [];
              const postfix: string[] = [];

              let prefixIndex = actualIndex;
              while (
                prefixIndex >= 0 &&
                digit_regex.test(previousRow[prefixIndex])
              ) {
                // not performant
                prefix.push(previousRow[prefixIndex]);

                prefixIndex--;
              }
              prefix.reverse();

              let postfixIndex = actualIndex;
              while (
                postfixIndex < rowLength &&
                digit_regex.test(previousRow[postfixIndex])
              ) {
                // not performant
                postfix.push(previousRow[postfixIndex]);

                postfixIndex++;
              }

              const num = Number(prefix.join("") + m[0] + postfix.join(""));
              console.log({ num });

              parts.push(num);

              break;
            }
          }
          case "e": {
            // check right before
            if (index === 0) {
              break;
            }

            let i = indices[0];

            let nums: string[] = [];

            while (digit_regex.test(row[i]) && i >= 0) {
              nums.push(row[i]);
              i--;
            }

            if (!nums.length) break;

            nums.reverse();

            const num = Number(nums.join(""));

            parts.push(num);
          }
          case "s": {
            if (rowIndex === rows.length - 1) {
              break;
            }
            const nextRow = rows[rowIndex + 1];
            // look in row above
            const areaToCheck = nextRow.slice(indices[0], indices[1] + 1);
            const m = areaToCheck.match(digit_regex);
            if (m?.index !== undefined) {
              //   then we've got to check around the digit, so help me god there is a better way to do this that has better memory usage
              const actualIndex = indices[0] + m.index;

              const prefix: string[] = [];
              const postfix: string[] = [];

              let prefixIndex = actualIndex;
              while (
                prefixIndex >= 0 &&
                digit_regex.test(nextRow[prefixIndex])
              ) {
                // not performant
                prefix.push(nextRow[prefixIndex]);

                prefixIndex--;
              }
              prefix.reverse();

              let postfixIndex = actualIndex;
              while (
                postfixIndex < rowLength &&
                digit_regex.test(nextRow[postfixIndex])
              ) {
                // not performant
                postfix.push(nextRow[postfixIndex]);

                postfixIndex++;
              }

              const num = Number(prefix.join("") + m[0] + postfix.join(""));

              parts.push(num);

              break;
            }
          }
          case "w": {
            // check right after
            if (index === row.length - 1) {
              break;
            }
            let i = indices[1];

            let nums: string[] = [];

            while (digit_regex.test(row[i]) && i < rowLength) {
              nums.push(row[i]);
              i++;
            }

            if (!nums.length) break;

            const num = Number(nums.join(""));

            parts.push(num);
          }
        }
        directionIndex++;
      }

      if (parts.length === 2) {
        // console.log({ parts });
        // console.log(`${matchArr[0]} in row ${rowIndex} is a part`);
        const power = parts[0] * parts[1];
        return acc + power;
      }

      return acc;
    }, 0);

    return acc + sum;
  }, 0);

  console.log(total);
}

// await part_1("./input.txt");
await part_2("./input.txt");
