import { parse_numbers } from "../utils";

type Race = {
  time: number;
  record: number;
};
export function part1(input: string): number {
  const races = parse_races(input);

  return races.reduce((acc, race) => {
    const num_record_beaters = get_record_beaters(race);
    return acc * num_record_beaters;
  }, 1);
}

export function part2(input: string): number {
  //   const races = parse_races(input);

  const lines = input.split("\n");

  const time = Number(
    lines[0].split(":")[1].split(/\s+/).filter(Boolean).join("")
  );
  const record = Number(
    lines[1].split(":")[1].split(/\s+/).filter(Boolean).join("")
  );
  // this is obviously slow - but it works for example
  const n = get_record_beaters({ time, record });
  return n;
}

export function get_record_beaters(race: Race) {
  let num = 0;
  let speed = 0;

  while (speed <= race.time) {
    const distance = speed * (race.time - speed);

    if (distance > race.record) {
      num++;
    }

    speed++;
  }

  return num;
}

export function parse_races(doc: string): Array<Race> {
  const lines = doc.split("\n");
  const times = parse_numbers(lines[0]);
  const distances = parse_numbers(lines[1]);

  return times.map((time, index) => {
    return {
      time,
      record: distances[index],
    };
  });
}

async function input() {
  const [path] = Bun.argv.slice(2);
  if (!path) return;
  const f = Bun.file(path);

  const input = await f.text();
  console.log("part 1: ", part1(input));
  console.log("part 2: ", part2(input));
}

input();
