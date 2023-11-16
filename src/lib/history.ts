import {
  type ChatCompletionMessageParam,
  type CreateChatCompletionRequestMessage,
} from "openai/resources/chat/index.js";

const history: Array<CreateChatCompletionRequestMessage> = [];

export function addMessage(message: CreateChatCompletionRequestMessage) {
  history.push(message);
}

// https://help.openai.com/en/articles/4936856-what-are-tokens-and-how-to-count-them
const TOKEN_LIMIT = 3000;
const CHAR_LIMIT = TOKEN_LIMIT * 4;

export function getMessages(): ChatCompletionMessageParam[] {
  const subset = [];
  let charCount = 0;
  let i = history.length - 1;

  while (
    i >= 0 &&
    charCount + (history[i]?.content || "").length < CHAR_LIMIT
  ) {
    const message = history[i];
    const content = message?.content || "";
    charCount += content.length;
    message && subset.unshift(message);
    i--;
  }

  return subset;
}

export function clearHistory() {
  history.length = 0;
}
