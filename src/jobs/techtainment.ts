import createBeeminderDatapoint from "../lib/bm/createBeeminderDatapoint";
import getGoal from "../lib/bm/getGoal";

// https://stackoverflow.com/a/10639010/937377
function parse(str: string) {
  // validate year as 4 digits, month as 01-12, and day as 01-31
  const m = str.match(/^(\d{4})(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])$/);

  if (!m) {
    throw new Error(`Invalid date string: ${str}`);
  }

  const d = new Date(+m[1], +m[2] - 1, +m[3]);

  // check if month stayed the same (ie that day number is valid)
  if (d.getMonth() === +m[2] - 1) return d;
}

export default async function techtainment() {
  const exercise = await getGoal("narthur", "exercise");
  const daysums = exercise.datapoints.reduce((acc, datapoint) => {
    // YYYYMMDD
    const daystamp = datapoint.daystamp;

    // Check if the daystamp is within the last 7 days.
    const today = new Date();
    const day = parse(daystamp);
    const diff = Math.floor(
      (today.getTime() - day.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diff > 7) {
      return acc;
    }

    acc[daystamp] = (acc[daystamp] || 0) + datapoint.value;
    return acc;
  }, {} as Record<string, number>);

  Object.entries(daysums).forEach(([daystamp, daysum]) => {
    const multiplier = daysum > 0 ? -2 : 0;
    void createBeeminderDatapoint("narthur", "techtainment", {
      value: daysum * multiplier,
      daystamp,
      requestid: `exercise-${daystamp}`,
      comment: `exercise: ${daysum}`,
    });
  });
}

if (!process.env.VITEST_WORKER_ID) {
  console.log("running");
  void techtainment();
  console.log("done");
}
