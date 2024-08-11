import type { Thread } from "openai/resources/beta/threads/threads";

import getClient from "./getClient.js";

let thread: Thread;

export async function getThread() {
  if (!thread) {
    await resetThread();
  }

  return thread;
}

export async function resetThread() {
  thread = await getClient().beta.threads.create();
}
