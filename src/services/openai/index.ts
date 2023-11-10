import OpenAI from "openai";
import {
  ChatCompletionCreateParams,
  ChatCompletionMessage,
  ChatCompletionMessageParam,
} from "openai/resources/chat/index.js";

import { OPENAI_SECRET_KEY } from "../../secrets.js";

// upgrade to gpt-4-0613 when it's available
const MODEL = "gpt-3.5-turbo-0613";
// const MODEL = "gpt-4-0613";

let openai: OpenAI | undefined;

function getOpenAi() {
  if (!openai) {
    openai = new OpenAI({
      apiKey: OPENAI_SECRET_KEY.value(),
    });
  }

  return openai;
}

export async function getResponse(
  messages: Array<ChatCompletionMessageParam>,
  functions?: Array<ChatCompletionCreateParams.Function>
): Promise<ChatCompletionMessage> {
  console.info(
    "function messages:",
    messages.filter((m) => m.role === "function")
  );

  console.info("getting openai client");
  const client = getOpenAi();

  console.info("getting openai completion");
  const completion = await client.chat.completions.create({
    model: MODEL,
    messages,
    functions,
  });

  console.info("returning first openai completion message");
  return completion.choices[0].message;
}
