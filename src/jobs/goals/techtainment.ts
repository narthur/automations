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
    const dv = (p: Datapoint[]) => p.find((p) => p.daystamp === ds)?.value ?? 0;
    const ar = (dv(active) * -2) / 60;
    const zr = (dv(zone) * -2) / 60;
    const sr = -dv(steps) / (2 * 60 * 60);
    const tr = ar + zr + sr;
    const ps = (n: number) => Number(n.toFixed(2));

    return {
      value: ps(tr),
      comment: `active: ${ps(ar)}, zone: ${ps(zr)}, steps: ${ps(sr)}`,
    };
  },
});

export default {
  update,
};
