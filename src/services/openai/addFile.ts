import type { Uploadable } from "openai/uploads.mjs";

import getClient from "./getClient";

export default async function addFile(options: { file: Uploadable }) {
  const c = getClient();
  const assistantId = process.env.OPENAI_ASSISTANT_ID;

  if (!assistantId) {
    throw new Error("No assistant ID found");
  }

  const assistant = await c.beta.assistants.retrieve(assistantId);
  const storeId = assistant.tool_resources?.file_search?.vector_store_ids?.[0];

  if (!storeId) {
    throw new Error("No vector store found");
  }

  await c.beta.vectorStores.fileBatches.uploadAndPoll(storeId, {
    files: [options.file],
  });
}
