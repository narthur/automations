import getClient from "./getClient.js";

export default async function replaceVectoryStore(storeName: string) {
  const c = getClient();

  const stores = await c.beta.vectorStores.list();

  for (const store of stores.data) {
    if (store.name === storeName) {
      await c.beta.vectorStores.del(store.id);
    }
  }
}
