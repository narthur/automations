import { Configuration, OpenAIApi } from "openai";
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

export async function getResponse(prompt: string) {
  const completion = await getOpenAi().createChatCompletion({
    model: MODEL,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  return completion.data.choices[0].message;
}
