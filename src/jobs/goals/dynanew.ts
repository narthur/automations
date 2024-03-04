import getGoal from "src/services/beeminder/getGoal.js";
import getNodes from "src/services/dynalist/getNodes.js";

import { makeUpdater } from "./index.js";

const DAY = 24 * 60 * 60 * 1000;

export const update = makeUpdater({
  user: "narthur",
  goal: "dynanew",
  getSharedData: async () => ({
    nodes: await getNodes(),
    goal: await getGoal("narthur", "dynanew"),
  }),
  getDateUpdate: (date, { nodes, goal }) => {
    const ms = goal.deadline * 1000;
    const max = date.getTime() + ms;
    const min = max - DAY;
    const matches = nodes.filter((n) => n.created <= max && n.created > min);

    return Promise.resolve({
      value: matches.length,
    });
  },
});
