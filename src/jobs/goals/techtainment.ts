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
    const pf = (p: Datapoint[]) => p.filter((p) => p.daystamp === ds);
    const as = pf(zone).reduce((acc, p) => acc + p.value, 0);
    const zs = pf(active).reduce((acc, p) => acc + p.value, 0);
    const ss = steps.find((p) => p.daystamp === ds)?.value ?? 0;
    const ah = as / 60;
    const zh = zs / 60;
    const ar = -ah * 2;
    const zr = -zh * 2;
    const sr = -ss / (2 * 60 * 60);

    return {
      value: ar + +zr + sr,
      comment: `active: ${ar}, zone: ${zr}, steps: ${sr}`,
    };
  },
});

export default {
  update,
};
