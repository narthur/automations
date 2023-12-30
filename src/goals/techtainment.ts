import { makeUpdater } from "src/goals/index.js";
import makeDaystamp from "src/lib/makeDaystamp";
import getDatapoints from "src/services/beeminder/getDatapoints";
import type { Datapoint } from "src/services/beeminder/types/datapoint";

export const update = makeUpdater({
  user: "narthur",
  goal: "techtainment",
  getSharedData: () =>
    getDatapoints("narthur", "active", {
      count: 7,
    }),
  getDateUpdate: (d: Date, points: Datapoint[]) => {
    const p = points.find(
      (p) => p.daystamp === makeDaystamp(d).replaceAll("-", "")
    );
    const h = (p?.value ?? 0) / 60;

    return {
      value: -h * 2,
    };
  },
});

export default {
  update,
};
