const text = await Bun.file("input.txt").text();

const limits = {
  red: 12,
  green: 13,
  blue: 14,
} as const;

type Color = keyof typeof limits;

const colorToRegex = new Map(
  (Object.keys(limits) as Array<Color>).map((color) => {
    const r = new RegExp(`(\\d+) ${color}`);
    console.log({ r });
    return [color, r];
  })
);

const game_regex = /Game (\d+): /;

const total = text.split("\n").reduce((acc, curr) => {
  console.log(`---- new line ----`);
  console.log(`line: ${curr}`);
  // Tried a more elegant Regex, but this hacky way works

  const game = curr.match(game_regex)?.[1];
  if (!game) {
    throw new Error("Game number not found.");
  }

  //   console.log({ game, curr });

  const sets = curr.split(game_regex)[2].split(";");

  let totals = new Map<Color, number>();

  for (const set of sets) {
    console.log({ set });
    for (const [color, regex] of colorToRegex.entries()) {
      const c = set.match(regex)?.[1];
      console.log({ set, c, color, regex });
      if (c) {
        let t = totals.get(color) ?? 0;
        t += +c;
        console.log(`total for ${color}: ${t}`);
        totals.set(color, t);
      }
    }
  }

  // check that totals are within limits
  const isWithinLimits = Array.from(totals.entries()).every(
    ([color, total]) => total <= limits[color]
  );

  //   console.log({ isWithinLimits, totals: Array.from(totals.entries()) });

  if (isWithinLimits) {
    console.log(`This game is possible`);
    return acc + +game;
  }
  console.log("This game is not possible");
  return acc;
}, 0);

console.log(total);
