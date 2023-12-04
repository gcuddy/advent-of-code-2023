type CardData = {
  card: number;
  numbers: number[];
  winning_numbers: number[];
};

const card_regex = /Card\s+(\d+)\:\s?/;
const number_regex = /(\d+)/g;

export function getCardData(line: string): CardData {
  const [, card_num, all_nums] = line.split(card_regex);
  const [numbers_str, winning_numbers_str] = all_nums.split("|");

  const numbers = Array.from(numbers_str.matchAll(number_regex)).map(
    (n) => +n[0]
  );
  const winning_numbers = Array.from(
    winning_numbers_str.matchAll(number_regex)
  ).map((n) => +n[0]);

  return {
    card: +(card_num ?? 0),
    numbers,
    winning_numbers,
  };
}

export function getWinningNumbers(
  winning_numbers: number[],
  numbers: number[]
): number[] {
  // basically getting numbers in the given arr, could make this into util

  const matches: number[] = [];

  for (let i = 0; i < numbers.length; i++) {
    const n = numbers[i];
    if (winning_numbers.includes(n)) matches.push(n);
  }

  return matches;
}

export function totalWinningNumbers(count: number): number {
  let score = 0;

  let i = 0;

  while (i < count) {
    i++;
    if (i === 1) {
      score += 1;
    } else {
      score *= 2;
    }
  }

  return score;
}

export function getCardCopies(cardNum: number, winCount: number): number[] {
  const copies: number[] = [];

  let card = cardNum + 1;

  for (let i = 0; i < winCount; i++) {
    copies.push(card);
    card++;
  }

  return copies;
}

export function part1(input: string): number {
  const rows = input.split("\n");

  const total = rows.reduce((acc, row) => {
    if (!row) return acc;
    const { numbers, winning_numbers } = getCardData(row);
    const wins = getWinningNumbers(winning_numbers, numbers);
    const total = totalWinningNumbers(wins.length);

    return acc + total;
  }, 0);

  return total;
}

export function part2(input: string): number {
  const games = input.split("\n");

  let total = 0;
  const copiesMap = new Map<number, number[]>();
  const unprocessed_games: number[] = [];

  // loop through games once to get unprocessed copies, and build copies map
  games.forEach((game) => {
    // protect against empty lines
    if (!game.trim()) return;

    const { card, copies } = getWinCopies(game);
    total++;
    copiesMap.set(card, copies);
    unprocessed_games.push(...copies);
  });

  while (unprocessed_games.length) {
    total++;
    const game = unprocessed_games.pop();
    if (!game) break;
    const copies = copiesMap.get(game);
    if (copies) unprocessed_games.push(...copies);
  }

  return total;
}

/**
 * main function to take a game and produce array of card nums
 */
export function getWinCopies(game: string): { card: number; copies: number[] } {
  const { numbers, winning_numbers, card } = getCardData(game);
  const wins = getWinningNumbers(winning_numbers, numbers);
  const winCount = wins.length;
  const copies = getCardCopies(card, winCount);

  return { card, copies };
}

// handle input
async function input() {
  const [path] = Bun.argv.slice(2);
  if (!path) return;
  const f = Bun.file(path);

  const input = await f.text();

  console.log("part 1: ", part1(input));
  console.log("part 2:", part2(input));
}

input();
