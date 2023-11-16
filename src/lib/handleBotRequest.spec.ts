import createDatapoint from "src/services/beeminder/createDatapoint.js";
import { describe, expect, it, vi } from "vitest";

import { getResponse } from "../services/openai/index.js";
import { sendMessage } from "../services/telegram/index.js";
import handleBotRequest from "./handleBotRequest.js";

function send(text: string) {
  return handleBotRequest({
    request: {
      headers: {
        get: (key: string) =>
          ({
            "x-telegram-bot-api-secret-token":
              "__TELEGRAM_WEBHOOK_TOKEN_VALUE__",
          }[key]),
      },
      body: {
        message: {
          chat: {
            id: "chat_id",
          },
          from: {
            id: "__TELEGRAM_ALLOWED_USER_VALUE__",
          },
          text,
        },
      },
    },
  } as any);
}

describe("handleBotRequest", () => {
  it("sends error messages to the user", async () => {
    vi.mocked(getResponse).mockRejectedValue(new Error("test error"));

    await send("test");

    expect(sendMessage).toBeCalled();
  });

  it("splits long errors", async () => {
    vi.mocked(getResponse).mockRejectedValue(
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

  it("sends incoming message lengths to beeminder", async () => {
    await send("test");

    expect(createDatapoint).toBeCalledWith(
      "narthur",
      "mia",
      expect.objectContaining({
        value: 4,
      })
    );
  });
});
