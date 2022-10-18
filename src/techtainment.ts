import createDatapoint from "./lib/bm/createDatapoint";
import getGoal from "./lib/bm/getGoal";

export default async function techtainment() {
  const exercise = await getGoal("narthur", "exercise");
  const daysums = exercise.datapoints.reduce((acc, datapoint) => {
    const daystamp = datapoint.daystamp;
    acc[daystamp] = (acc[daystamp] || 0) + datapoint.value;
    return acc;
  }, {} as Record<string, number>);

  Object.entries(daysums).forEach(([daystamp, daysum]) => {
    const value = daysum > 0 ? -2 : 0;
    void createDatapoint("narthur", "techtainment", {
      value,
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
