import { createDatapoint } from "src/services/beeminder.js";
import { getDocument, getFiles } from "src/services/dynalist.js";
import getWeekDates from "./getWeekDates.js";
import { DynalistNode } from "src/services/dynalist.types.js";

type Document = {
  nodes: DynalistNode[];
};

function ds(date: Date): string {
  return date.toISOString().slice(0, 10);
}

async function updateDynanew(date: Date, docs: Document[]) {
  const daystamp = ds(date);
  const nodes = docs.map((d) => d.nodes).flat();
  const matches = nodes.filter((n) => ds(new Date(n.created)) === daystamp);

  await createDatapoint("narthur", "dynanew", {
    value: matches.length,
    daystamp,
    requestid: daystamp,
  });
}

export default async function updateDynalistGoals() {
  const { files } = await getFiles();
  const docs: Document[] = await Promise.all(
    files
      .filter((f) => f.type === "document")
      .map((f) => getDocument({ file_id: f.id }))
  );

  await Promise.all(getWeekDates().map((d) => updateDynanew(d, docs)));
}
