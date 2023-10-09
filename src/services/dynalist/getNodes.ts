import { getDocument, getFiles } from "./index.js";
import { DynalistNode } from "./types.js";

const getNodes = async (): Promise<DynalistNode[]> => {
  const { files } = await getFiles();
  const docs = await Promise.all(
    files
      .filter((f) => f.type === "document")
      .map((f) => getDocument({ file_id: f.id }))
  );
  return docs.map((d) => d.nodes).flat();
};

export default getNodes;
