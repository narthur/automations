import type { Thread } from "openai/resources/beta/threads/threads";
import { toFile } from "openai/uploads.mjs";

import addFile from "./addFile.js";
import getClient from "./getClient.js";

let thread: Thread;

export async function getThread() {
  if (!thread) {
    await resetThread();
  }

  return thread;
}

export async function resetThread() {
  const c = getClient();

  if (thread) {
    const messages = await c.beta.threads.messages.list(thread.id);

    const transcript = messages.data
      .map((m) => {
        const time = new Date(m.created_at).toLocaleString();
        return `${m.role} at ${time}:\n\n${m.content.join("\n\n")}`;
      })
      .join("\n\n\n");

    const firstTime = new Date(messages.data[0].created_at).toLocaleString();
    const lastTime = new Date(
      messages.data[messages.data.length - 1].created_at
    ).toLocaleString();
    const fileName = `transcript-${firstTime}-${lastTime}.txt`;

    const file = await toFile(Buffer.from(transcript), fileName);

    await addFile(file);
  }

  thread = await c.beta.threads.create();
}
