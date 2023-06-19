import { Configuration, OpenAIApi } from "openai";
import { openAiSecretKey } from "../secrets";

const MODEL = "gpt-3.5-turbo-0613";

const configuration = new Configuration({
  apiKey: openAiSecretKey.value(),
});

const openai = new OpenAIApi(configuration);

export async function getResponse(prompt: string) {
  const completion = await openai.createChatCompletion({
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
