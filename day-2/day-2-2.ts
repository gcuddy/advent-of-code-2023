const text = await Bun.file("input.txt").text();

const limits = {
  red: 12,
  green: 13,
  blue: 14,
} as const;

type Color = keyof typeof limits;

const game_regex = /Game (\d+): /;
const color_regex = /(\d+) (red|green|blue)/g;

const total = text.split("\n").reduce((acc, curr) => {
  const game = curr.match(game_regex)?.[1];

  if (!game) {
    throw new Error("Game number not found.");
  }

  // Tried a more elegant Regex, but this hacky way works
  const sets = curr.split(game_regex)[2].split(";");

  let totals = new Map<Color, number>();

  //   console.log(curr);

  sets.forEach((set) => {
    const matches = Array.from(set.matchAll(color_regex));
    return matches.forEach((match) => {
      const num = +match[1];
      const color = match[2];
      if (!num || !color) return;
      const currentTotal = totals.get(color as Color) ?? 0;
      if (num > currentTotal) {
        totals.set(color as Color, num);
      }
    });
  });

  const totalEntries = Array.from(totals.entries());

  const power = totalEntries.reduce((acc, [color, num]) => {
    // console.log(`Minimum of ${num} ${color} cubes`);
    return acc * num;
  }, 1);

  return acc + power;
}, 0);

console.log(total);
