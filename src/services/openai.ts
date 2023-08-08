import {
  Configuration,
  OpenAIApi,
  ChatCompletionResponseMessage,
  ChatCompletionRequestMessage,
  ChatCompletionFunctions,
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
  messages: Array<ChatCompletionRequestMessage>,
  functions?: Array<ChatCompletionFunctions>
): Promise<ChatCompletionResponseMessage | undefined> {
  console.info(
    "function messages:",
    messages.filter((m) => m.role === "function")
  );

  console.info("getting openai client");
  const client = getOpenAi();

  console.info("getting openai completion");
  const completion = await client.createChatCompletion({
    model: MODEL,
    messages,
    functions,
  });

  console.info("returning first openai completion message");
  return completion?.data.choices[0].message;
}
