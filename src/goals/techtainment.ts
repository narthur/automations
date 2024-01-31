import { makeUpdater } from "src/goals/index.js";
import makeDaystamp from "src/lib/makeDaystamp";
import getDatapoints from "src/services/beeminder/getDatapoints";
import refreshGoal from "src/services/beeminder/refreshGoal";
import type { Datapoint } from "src/services/beeminder/types/datapoint";

export const update = makeUpdater({
  user: "narthur",
  goal: "techtainment",
  getSharedData: async () => {
    await refreshGoal("narthur", "zone");
    await refreshGoal("narthur", "active");

    const options = {
      count: 7,
    };

    return [
      ...(await getDatapoints("narthur", "zone", options)),
      ...(await getDatapoints("narthur", "active", options)),
    ];
  },
  getDateUpdate: (d: Date, points: Datapoint[]) => {
    const ds = makeDaystamp(d).replaceAll("-", "");
    const sum = points
      .filter((p) => p.daystamp === ds)
      .reduce((acc, p) => acc + p.value, 0);
    const h = sum / 60;

    return {
      value: -h * 2,
    };
  },
});

export default {
  update,
};
