import env from "src/lib/env";
import message from "src/services/telegram/schemas/message";
import user from "src/services/telegram/schemas/user";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createFixture } from "zod-fixture";

import { POST } from "./telegram";

const messageFixture = createFixture(message, {
  seed: 1,
});

const userFixture = createFixture(user, {
  seed: 1,
});

describe("telegram", () => {
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

  it("has bot hook", async () => {
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
          text: "hello world",
        },
      }),
    });

    const res = await POST({ request } as any);

    expect(res.status).toBe(200);
    expect(await res.text()).toBe("OK");
  });
});
