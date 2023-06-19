import {
  Configuration,
  OpenAIApi,
  ChatCompletionResponseMessage,
} from "openai";
import { openAiSecretKey } from "../secrets";

const MODEL = "gpt-3.5-turbo-0613";

let openai: OpenAIApi | undefined;

function getOpenAi() {
  if (!openai) {
    const configuration = new Configuration({
      apiKey: openAiSecretKey.value(),
    });

    openai = new OpenAIApi(configuration);
  }

  return openai;
}

export async function getResponse(
  prompt: string,
  functions?: {
    name: string;
    description?: string;
    parameters?: Record<string, unknown>;
  }[]
): Promise<ChatCompletionResponseMessage | undefined> {
  console.info("getting openai client");
  const client = getOpenAi();

  console.info("getting openai completion");
  const completion = await client.createChatCompletion({
    model: MODEL,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    functions,
  });

  console.info("returning first openai completion message");
  return completion.data.choices[0].message;
}
