import {
  type ChatCompletionMessage,
  type ChatCompletionMessageParam,
} from "openai/resources/chat/index.js";
import env from "src/lib/env.js";
import { getFunctionDefinitions, getFunctionResponse } from "src/lib/gptFns.js";
import { addMessage, getMessages } from "src/lib/history.js";

import splitMessages from "../../lib/splitMessages.js";
import { getResponse } from "../../services/openai/index.js";

function hasFunctionCall(
  message: ChatCompletionMessage
): message is ChatCompletionMessage & {
  function_call: {
    name: string;
    arguments: string;
  };
} {
  return Boolean(message.function_call);
}

export default async function getGptResponse(
  prompt: string
): Promise<string[]> {
  console.info("getting openai response");
  const systemPrompt = env("OPENAI_PROMPT");

  if (!systemPrompt) {
    throw new Error("OPENAI_PROMPT env var not set");
  }

  const messages: Array<ChatCompletionMessageParam> = [
    {
      role: "system",
      content: systemPrompt,
    },
    ...getMessages(),
    {
      role: "user",
      content: prompt,
    },
  ];
  addMessage({
    role: "user",
    content: prompt,
  });
  const raw = await getResponse(messages, getFunctionDefinitions());
  if (!raw) throw new Error("no response from openai");
  console.info("parsing openai response");

  const content = (await getFunctionResponse(raw)) || raw.content || "";

  if (hasFunctionCall(raw)) {
    addMessage({
      role: "assistant",
      name: raw.function_call?.name,
      content,
      function_call: raw.function_call,
    });
  } else {
    addMessage({
      role: "assistant",
      content,
    });
  }
  return splitMessages(content);
}
