import createDatapoint from "./lib/bm/createDatapoint";
import getGoal from "./lib/bm/getGoal";

export default async function techtainment() {
  const exercise = await getGoal("narthur", "exercise");
  const daysum = exercise.datapoints.reduce(
    (sum, dp: Datapoint) => sum + dp.value,
    0
  );

  await createDatapoint("narthur", "techtainment", {
    value: -daysum * 2,
  });
}
