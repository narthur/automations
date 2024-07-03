import OpenAI from "openai";
import {
  type ChatCompletionCreateParams,
  type ChatCompletionMessage,
  type ChatCompletionMessageParam,
} from "openai/resources/chat/index.js";

import env from "../../lib/env.js";

const MODEL = "gpt-4o";

let openai: OpenAI | undefined;

function getOpenAi() {
  if (!openai) {
    openai = new OpenAI({
      apiKey: env("OPENAI_SECRET_KEY"),
    });
  }

  return openai;
}

export async function getResponse(
  messages: Array<ChatCompletionMessageParam>,
  functions: Array<ChatCompletionCreateParams.Function> = []
): Promise<ChatCompletionMessage | undefined> {
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
  return completion.choices[0]?.message;
}
