import { makeUpdater } from "src/jobs/goals/index.js";
import makeDaystamp from "src/lib/makeDaystamp";
import getDatapoints from "src/services/beeminder/getDatapoints";
import refreshGoal from "src/services/beeminder/refreshGoal";
import type { Datapoint } from "src/services/beeminder/types/datapoint";

const sources = ["zone", "active", "steps"] as const;

type Shared = Record<(typeof sources)[number], Datapoint[]>;

export const update = makeUpdater({
  user: "narthur",
  goal: "techtainment",
  getSharedData: async () => {
    await Promise.all(sources.map((g) => refreshGoal("narthur", g)));

    return sources.reduce(
      async (acc, g) => ({
        ...(await acc),
        [g]: await getDatapoints("narthur", g, { count: 7 }),
      }),
      Promise.resolve({} as Shared)
    );
  },
  getDateUpdate: (d: Date, { zone, active, steps }: Shared) => {
    const ds = makeDaystamp(d).replaceAll("-", "");
    const as = [...zone, ...active]
      .filter((p) => p.daystamp === ds)
      .reduce((acc, p) => acc + p.value, 0);
    const ss = steps.find((p) => p.daystamp === ds)?.value ?? 0;
    const ah = as / 60;
    const ar = -ah * 2;
    const sr = -ss / (2 * 60 * 60);

    return { value: ar + sr };
  },
});

export default {
  update,
};
