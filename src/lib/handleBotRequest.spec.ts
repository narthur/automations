import getGptResponse from "src/services/openai/getGptResponse.js";
import message from "src/services/telegram/schemas/message.js";
import user from "src/services/telegram/schemas/user.js";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createFixture } from "zod-fixture";

import { sendMessage } from "../services/telegram/index.js";
import env from "./env.js";
import handleBotRequest from "./handleBotRequest.js";

const messageFixture = createFixture(message, {
  seed: 1,
});

const userFixture = createFixture(user, {
  seed: 1,
});

function send(text: string) {
  const request = new Request("https://example.com/hooks/telegram", {
    method: "POST",
    headers: {
      "x-telegram-bot-api-secret-token": "the_token",
    },
    body: JSON.stringify({
      update_id: 1,
      message: {
        ...messageFixture,
        chat: {
          ...messageFixture.chat,
          id: 7,
        },
        from: {
          ...userFixture,
          id: 7,
        },
        text,
      },
    }),
  });

  return handleBotRequest({
    request,
  } as any);
}

describe("handleBotRequest", () => {
  beforeEach(() => {
    vi.mocked(env).mockImplementation(
      (k) =>
        ({
          [k]: "another_value",
          TELEGRAM_WEBHOOK_TOKEN: "the_token",
          TELEGRAM_ALLOWED_USER: "7",
        }[k])
    );
  });

  it("sends error messages to the user", async () => {
    vi.mocked(getGptResponse).mockRejectedValue(new Error("test error"));

    await send("test");

    expect(sendMessage).toBeCalled();
  });

  it("splits long errors", async () => {
    vi.mocked(getGptResponse).mockRejectedValue(
      new Error("test error".repeat(1000))
    );

    await send("test");

    const { calls } = vi.mocked(sendMessage).mock;

    expect(calls.length).toBeGreaterThan(1);
  });

  it("supports slash commands", async () => {
    await send("/foo");

    expect(sendMessage).toBeCalledWith(
      expect.objectContaining({
        text: expect.stringContaining("bar"),
      })
    );
  });
});
