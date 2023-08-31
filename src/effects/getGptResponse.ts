import { getResponse } from "../services/openai";
import splitMessages from "../transforms/splitMessages";
import { addMessage, getMessages } from "../services/firestore";
import {
  ChatCompletion,
  CreateChatCompletionRequestMessage,
} from "openai/resources/chat";
import { openAiPrompt } from "../secrets";
import { getFunctionResponse, getFunctionDefinitions } from "./gptFns";

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
  const history = await getMessages();
  const messages: Array<CreateChatCompletionRequestMessage> = [
    {
      role: "system",
      content: openAiPrompt.value(),
    },
    ...history.map((m) => m.message),
    {
      role: "user",
      content: prompt,
    },
  ];
  await addMessage({
    role: "user",
    content: prompt,
  });
  const raw = await getResponse(messages, getFunctionDefinitions());
  if (!raw) throw new Error("no response from openai");
  console.info("parsing openai response");
  const content = (await getFunctionResponse(raw)) || raw.content || "";
  if (hasFunctionCall(raw)) {
    await addMessage({
      role: "assistant",
      name: raw.function_call?.name,
      content,
      function_call: raw.function_call,
    });
  } else {
    await addMessage({
      role: "assistant",
      content,
    });
  }
  return splitMessages(content);
}
