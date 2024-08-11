import type { Uploadable } from "openai/uploads.mjs";

import deleteAllFiles from "./deleteAllFiles.js";
import deleteVectorStore from "./deleteVectorStore.js";
import getClient from "./getClient.js";

export default async function replaceVectoryStore(
  storeName: string,
  files: Uploadable[]
) {
  const c = getClient();

  await deleteAllFiles();
  await deleteVectorStore(storeName);

  const store = await c.beta.vectorStores.create({
    name: storeName,
  });

  await c.beta.vectorStores.fileBatches.uploadAndPoll(store.id, {
    files,
  });

  await c.beta.assistants.update(process.env.OPENAI_ASSISTANT_ID || "", {
    tool_resources: {
      file_search: {
        vector_store_ids: [store.id],
      },
    },
  });
}
