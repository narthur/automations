import {
  Configuration,
  OpenAIApi,
  ChatCompletionResponseMessage,
  ChatCompletionRequestMessage,
  ChatCompletionFunctions,
} from "openai";
import { openAiSecretKey } from "../secrets";
import { z } from "zod";

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

const zError = z.object({
  data: z.object({
    error: z.unknown(),
  }),
});

export async function getResponse(
  messages: Array<ChatCompletionRequestMessage>,
  functions?: Array<ChatCompletionFunctions>
): Promise<ChatCompletionResponseMessage | undefined> {
  console.info("getting openai client");
  const client = getOpenAi();

  console.info("getting openai completion");
  const completion = await client
    .createChatCompletion({
      model: MODEL,
      messages,
      functions,
    })
    .catch((e) => {
      const parsed = zError.safeParse(e);
      console.error(
        "openai error",
        parsed.success ? parsed.data.data.error : e
      );
      return undefined;
    });

  console.info("returning first openai completion message");
  return completion?.data.choices[0].message;
}
