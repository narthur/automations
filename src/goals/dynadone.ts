import makeDaystamp from "src/lib/makeDaystamp.js";
import getNodes from "src/services/dynalist/getNodes.js";
import { DynalistNode } from "src/services/dynalist/types.js";

import { makeUpdater } from "./index.js";

export const update = makeUpdater({
  user: "narthur",
  goal: "dynadone",
  getSharedData: getNodes,
  getDateUpdate: (date, nodes) => {
    const daystamp = makeDaystamp(date);
    const shouldCount = (n: DynalistNode) =>
      n.checked && makeDaystamp(new Date(n.modified)) === daystamp;
    const matches = nodes.filter(shouldCount);

    return Promise.resolve({
      value: matches.length,
    });
  },
});
