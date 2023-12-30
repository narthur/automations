import { makeUpdater } from "src/goals/index.js";
import makeDaystamp from "src/lib/makeDaystamp";
import getDatapoints from "src/services/beeminder/getDatapoints";
import type { Datapoint } from "src/services/beeminder/types/datapoint";

export const update = makeUpdater({
  user: "narthur",
  goal: "techtainment",
  getSharedData: () => getDatapoints("narthur", "active"),
  getDateUpdate: (d: Date, points: Datapoint[]) =>
    points.find((p) => p.daystamp === makeDaystamp(d).replaceAll("-", "")) ?? {
      value: 0,
    },
});

export default {
  update,
};
