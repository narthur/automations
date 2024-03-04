import getGoal from "src/services/beeminder/getGoal.js";
import getNodes from "src/services/dynalist/getNodes.js";

import { makeUpdater } from "./index.js";

const DAY = 24 * 60 * 60 * 1000;

export const update = makeUpdater({
  user: "narthur",
  goal: "dynadone",
  getSharedData: async () => ({
    nodes: await getNodes(),
    goal: await getGoal("narthur", "dynadone"),
  }),
  getDateUpdate: (date, { nodes, goal }) => {
    const ms = goal.deadline * 1000;
    const max = date.getTime() + ms;
    const min = max - DAY;
    const matches = nodes.filter(
      (n) => n.checked && n.modified <= max && n.modified > min
    );

    return Promise.resolve({
      value: matches.length,
    });
  },
});
