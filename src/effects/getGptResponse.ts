import { getResponse } from "../services/openai.js";
import splitMessages from "../transforms/splitMessages.js";
import {
  ChatCompletion,
  CreateChatCompletionRequestMessage,
} from "openai/resources/chat/index.js";
import { openAiPrompt } from "../secrets.js";
import { getFunctionResponse, getFunctionDefinitions } from "./gptFns.js";
import { addMessage, getMessages } from "./history.js";

function hasFunctionCall(
  message: ChatCompletion.Choice.Message
): message is ChatCompletion.Choice.Message & {
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
  const messages: Array<CreateChatCompletionRequestMessage> = [
    {
      role: "system",
      content: openAiPrompt.value(),
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
