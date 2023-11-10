import makeDaystamp from "src/lib/makeDaystamp.js";
import getNodes from "src/services/dynalist/getNodes.js";
import { DynalistNode } from "src/services/dynalist/types.js";

import { makeUpdater } from "./index.js";

function getDateUpdate(date: Date, nodes: DynalistNode[]) {
  const daystamp = makeDaystamp(date);
  const isOnDate = (n: DynalistNode) =>
    makeDaystamp(new Date(n.created)) === daystamp;
  const matches = nodes.filter(isOnDate);

  return Promise.resolve({
    value: matches.length,
  });
}

export const update = makeUpdater({
  user: "narthur",
  goal: "dynanew",
  getSharedData: getNodes,
  getDateUpdate,
});
