import { getDocument, getFiles } from "./index.js";
import { type DynalistNode } from "./types.js";

type AugmentedNode = DynalistNode & {
  file_id: string;
};

const getNodes = async (): Promise<AugmentedNode[]> => {
  const { files } = await getFiles();
  const docs = await Promise.all(
    files
      .filter((f) => f.type === "document")
      .map((f) => getDocument({ file_id: f.id }))
  );
  return docs
    .map((d) => {
      return d.nodes.map((n) => ({
        ...n,
        file_id: d.file_id,
      }));
    })
    .flat();
};

export default getNodes;
