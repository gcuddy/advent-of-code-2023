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

const lookup_regex = new RegExp(Object.keys(lookup).join("|"), "g");

const tests = ["4gbdzqtddmt4eightsixfive"];

const num = text.split("\n").reduce((acc, curr) => {
  if (!curr.trim()) return acc;
  let firstDigitIndex: number | undefined = undefined;
  let firstDigit: number | undefined = undefined;
  let secondDigitIndex: number | undefined = undefined;
  let secondDigit: number | undefined = undefined;

  function set_index(index: number, v: number) {
    if (!firstDigitIndex || index < firstDigitIndex) {
      firstDigit = v;
      firstDigitIndex = index;
    } else if (!secondDigitIndex || index > secondDigitIndex) {
      secondDigit = v;
      secondDigitIndex = index;
    }
  }

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
  console.log([firstDigit, secondDigit]);
  console.log({ firstDigitIndex, secondDigitIndex });
  //   console.log(lookup_regex.test(curr));

  const text_matches = [...curr.matchAll(lookup_regex)];
  const firstMatch = text_matches[0];
  const lastMatch = text_matches.at(-1);

  //   "digit" -> [firstIndex, lastIndex]
  const matches: Record<number, [number, number]> = {};

  Object.entries(lookup).forEach(([k, v]) => {
    matches[v] = [curr.indexOf(k), curr.lastIndexOf(k)];
  });
  console.log(matches);

  Object.entries(matches).forEach(([k, v]) => {
    // console.log({k, v, firstDigitIndex, secondDigitIndex})
    if (
      v[0] > -1 &&
      (firstDigitIndex === undefined || v[0] < firstDigitIndex)
    ) {
      //   console.log(`setting firstDigit to ${k}, ${v[0]}`);
      firstDigit = +k;
      firstDigitIndex = v[0];
    }
    if (
      v[1] > -1 &&
      (secondDigitIndex === undefined || (v[1] > -1 && v[1] > secondDigitIndex))
    ) {
      //   console.log("setting sec");
      secondDigit = +k;
      secondDigitIndex = v[1];
    }
  });

  //   //   console.log(firstMatch, firstDigitIndex, firstMatch.index)

  //   if (
  //     firstMatch &&
  //     firstMatch.index !== undefined &&
  //     firstMatch.index < firstDigitIndex!
  //   ) {
  //     // console.log({curr, firstDigitIndex, index: firstMatch.index})
  //     firstDigit = lookup[firstMatch[0]];
  //     firstDigitIndex = firstMatch.index;
  //   }

  //   if (
  //     lastMatch &&
  //     lastMatch.index !== undefined &&
  //     lastMatch.index > secondDigitIndex!
  //   ) {
  //     secondDigit = lookup[lastMatch[0]];
  //     secondDigitIndex = lastMatch.index;
  //   }

  console.log(curr, [firstDigit, secondDigit]);

  // now see if string contains number.

  const num = `${firstDigit}${secondDigit}`;

  return acc + +num;
}, 0);

console.log(num);
