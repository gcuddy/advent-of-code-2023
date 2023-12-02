const path = "./input.txt";

const file = Bun.file(path);

const text = await file.text();

const num = text.split("\n").reduce((acc, curr) => {
  if (!curr.trim()) return acc;
  let firstDigit: number | undefined = undefined;
  let secondDigit: number | undefined = undefined;
  let i = 0;
  while (!firstDigit && i < curr.length) {
    const n = Number(curr[i]);
    if (!Number.isNaN(n)) {
      firstDigit = n;
    }
    i++;
  }

  let j = curr.length - 1;
  while (!secondDigit && j >= 0) {
    const n = Number(curr[j]);

    if (!Number.isNaN(n)) {
      secondDigit = n;
    }

    j--;
  }

  const num = `${firstDigit}${secondDigit}`;

  return acc + +num;
}, 0);

console.log(num);
