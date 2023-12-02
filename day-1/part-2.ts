const path = "./input.txt";

const file = Bun.file(path);

const text = await file.text();

const lookup: Record<string, number> = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
};

const num = text.split("\n").reduce((acc, curr) => {
  if (!curr.trim()) return acc;
  let firstDigitIndex: number | undefined = undefined;
  let firstDigit: number | undefined = undefined;
  let secondDigitIndex: number | undefined = undefined;
  let secondDigit: number | undefined = undefined;

  let i = 0;
  while (!firstDigit && i < curr.length) {
    const l = curr[i];
    const n = Number(l);

    if (!Number.isNaN(n)) {
      firstDigit = n;
      firstDigitIndex = i;
    }

    i++;
  }

  let j = curr.length - 1;
  while (!secondDigit && j >= 0) {
    const l = curr[j];
    const n = Number(l);

    if (!Number.isNaN(n)) {
      secondDigit = n;
      secondDigitIndex = j;
    }

    j--;
  }

  //   digit -> [firstIndex, lastIndex]
  const matches: Record<number, [number, number]> = {};

  Object.entries(lookup).forEach(([k, v]) => {
    matches[v] = [curr.indexOf(k), curr.lastIndexOf(k)];
  });

  Object.entries(matches).forEach(([k, v]) => {
    if (
      v[0] > -1 &&
      (firstDigitIndex === undefined || v[0] < firstDigitIndex)
    ) {
      firstDigit = +k;
      firstDigitIndex = v[0];
    }
    if (
      v[1] > -1 &&
      (secondDigitIndex === undefined || v[1] > secondDigitIndex)
    ) {
      secondDigit = +k;
      secondDigitIndex = v[1];
    }
  });

  const num = `${firstDigit}${secondDigit}`;

  return acc + +num;
}, 0);

console.log(num);
