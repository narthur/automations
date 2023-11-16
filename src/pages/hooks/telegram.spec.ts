import { describe, expect, it } from "vitest";

import { POST } from "./telegram";

describe("telegram", () => {
  it("has bot hook", async () => {
    const request = new Request("https://example.com/hooks/telegram", {
      method: "POST",
      headers: {
        "x-telegram-bot-api-secret-token": "__SECRET_TELEGRAM_WEBHOOK_TOKEN__",
      },
      body: JSON.stringify({
        message: {
          text: "hello world",
          from: {
            id: "__SECRET_TELEGRAM_ALLOWED_USER__",
          },
          chat: {
            id: "the_chat_id",
          },
        },
      }),
    });

    const res = await POST({ request } as any);

    expect(res.status).toBe(200);
    expect(await res.text()).toBe("OK");
  });
});
