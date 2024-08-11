import getClient from "./getClient.js";

export default async function deleteAllFiles() {
  const c = getClient();
  const response = await c.files.list();
  const fileIds = response.data.map((f) => f.id);

  console.log("Deleting files:", fileIds.length);

  for (const [i, id] of fileIds.entries()) {
    const k = `${i + 1}/${fileIds.length}: ${id}`;
    console.time(k);
    await c.files.del(id);
    console.timeEnd(k);
  }

  console.log("Deleted files:", fileIds.length);
}
