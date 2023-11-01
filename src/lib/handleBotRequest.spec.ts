import { getResponse } from "../services/openai/index.js";
import { describe, it, expect, vi } from "vitest";
import handleBotRequest from "./handleBotRequest.js";
import { sendMessage } from "../services/telegram/index.js";
import createDatapoint from "src/services/beeminder/createDatapoint.js";

function send(text: string) {
  return handleBotRequest(
    {
      headers: {
        "x-telegram-bot-api-secret-token": "__SECRET_TELEGRAM_WEBHOOK_TOKEN__",
      },
      body: {
        message: {
          chat: {
            id: "chat_id",
          },
          from: {
            id: "__SECRET_TELEGRAM_ALLOWED_USER__",
          },
          text,
        },
      },
    } as any,
    {
      status: () => ({
        send: () => {},
      }),
    } as any
  );
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
