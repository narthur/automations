import OpenAI from "openai";

let client: OpenAI;

export default function getClient() {
  if (!client) {
    client = new OpenAI();
  }
  return client;
}
