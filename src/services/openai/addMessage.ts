import type OpenAI from "openai";
import getClient from "./getClient";
import { getThread } from "./getThread";

export async function addMessage(
  body: OpenAI.Beta.Threads.Messages.MessageCreateParams
) {
  const c = getClient();
  const t = await getThread();

  await c.beta.threads.messages.create(t.id, body);
}
