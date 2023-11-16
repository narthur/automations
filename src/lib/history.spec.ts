import type { CreateChatCompletionRequestMessage } from "openai/resources/chat/completions.mjs";
import { beforeEach, describe, expect, it } from "vitest";

import { addMessage, clearHistory, getMessages } from "./history.js";

describe("history", () => {
  beforeEach(() => {
    clearHistory();
  });

  it("limits history tokens", () => {
    // https://help.openai.com/en/articles/4936856-what-are-tokens-and-how-to-count-them
    // 1 token ~= 4 chars in English
    // Depending on the model used, requests can use up to 4097 tokens shared
    // between prompt and completion.If your prompt is 4000 tokens, your
    // completion can be 97 tokens at most.
    // https://openai.com/pricing
    // Let's limit to 3000 tokens, leaving 1000 tokens for the completion.
    // That's 12000 characters roughly.

    const message = {
      role: "user",
      content: "a".repeat(6001),
    } as CreateChatCompletionRequestMessage;

    addMessage(message);
    addMessage(message);
    addMessage(message);

    const messages = getMessages();

    expect(messages).toHaveLength(1);
  });

  it("returns messages in chronological order", () => {
    addMessage({
      role: "user",
      content: "foo",
    });
    addMessage({
      role: "user",
      content: "bar",
    });

    const messages = getMessages();

    expect(messages[0]?.content).toBe("foo");
  });
});
