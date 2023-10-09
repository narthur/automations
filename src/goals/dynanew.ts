import { getDocument, getFiles } from "src/services/dynalist.js";
import { DynalistNode } from "src/services/dynalist.types.js";
import { makeUpdater } from "./index.js";
import makeDaystamp from "src/transforms/makeDaystamp.js";

type Document = {
  nodes: DynalistNode[];
};

function getDateUpdate(date: Date, docs: Document[]) {
  const daystamp = makeDaystamp(date);
  const nodes = docs.map((d) => d.nodes).flat();
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
  getSharedData: async () => {
    const { files } = await getFiles();
    return Promise.all(
      files
        .filter((f) => f.type === "document")
        .map((f) => getDocument({ file_id: f.id }))
    );
  },
  getDateUpdate,
});
