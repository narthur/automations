import "dotenv/config";

import getClient from "src/services/openai/getClient";

const c = getClient();
const stores = await c.beta.vectorStores.list();
const storeName = "MiaMemory";
const store = stores.data.find((store) => store.name === storeName);

if (!store) {
  throw new Error(`No vector store found with name ${storeName}`);
}

await c.beta.assistants.update(process.env.OPENAI_ASSISTANT_ID || "", {
  tool_resources: {
    file_search: {
      vector_store_ids: [store.id],
    },
  },
});
