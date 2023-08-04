import { getResponse } from "../services/openai";
import { describe, it, expect, vi } from "vitest";
import handleBotRequest from "./handleBotRequest";
import { sendMessage } from "../services/telegram";

describe("handleBotRequest", () => {
  it("sends error messages to the user", async () => {
    vi.mocked(getResponse).mockRejectedValue(new Error("test error"));

    await handleBotRequest(
      {
        headers: {
          "x-telegram-bot-api-secret-token":
            "__SECRET_TELEGRAM_WEBHOOK_TOKEN__",
        },
        body: {
          message: {
            chat: {
              id: "chat_id",
            },
            from: {
              id: "__SECRET_TELEGRAM_ALLOWED_USER__",
            },
            text: "test",
          },
        },
      } as any,
      {
        status: () => ({
          send: () => {},
        }),
      } as any
    );

    expect(sendMessage).toBeCalled();
  });

  it("splits long errors", async () => {
    vi.mocked(getResponse).mockRejectedValue(
      new Error("test error".repeat(1000))
    );

    await handleBotRequest(
      {
        headers: {
          "x-telegram-bot-api-secret-token":
            "__SECRET_TELEGRAM_WEBHOOK_TOKEN__",
        },
        body: {
          message: {
            chat: {
              id: "chat_id",
            },
            from: {
              id: "__SECRET_TELEGRAM_ALLOWED_USER__",
            },
            text: "test",
          },
        },
      } as any,
      {
        status: () => ({
          send: () => {},
        }),
      } as any
    );

    expect(vi.mocked(sendMessage).mock.calls.length).toBeGreaterThan(1);
  });
});
