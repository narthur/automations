import { createDatapoint } from "src/services/beeminder.js";
import { getDocument, getFiles } from "src/services/dynalist.js";

export default async function updateDynalistGoals() {
  const { files } = await getFiles();
  const docs = files
    .filter((f) => f.type === "document")
    .map((f) => getDocument({ file_id: f.id }));
  const daystamp = new Date().toISOString().slice(0, 10);
  const allNodes = (await Promise.all(docs)).map((d) => d.nodes).flat();
  const newNodes = allNodes.filter((n) => {
    const created = new Date(n.created).toISOString().slice(0, 10);
    return created === daystamp;
  });

  await createDatapoint("narthur", "dynanew", {
    value: newNodes.length,
    daystamp,
  });
}
