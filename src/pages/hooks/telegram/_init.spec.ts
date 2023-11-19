import { setWebhook } from "src/services/telegram";
import { describe, expect, it } from "vitest";

import { GET } from "./init";

describe("init", () => {
  it("has bot init", async () => {
    const request = new Request("https://example.com/hookts/telegram/init", {
      method: "GET",
    });

    const res = await GET({ request } as any);

    expect(res.status).toBe(200);

    expect(setWebhook).toBeCalled();
  });

  it("uses request host in webhook url", async () => {
    const request = new Request("https://example.com/hooks/telegram/init", {
      method: "GET",
    });

    const res = await GET({ request } as any);
    const text = await res.text();

    expect(text).toMatch(/https:\/\/example.com\/hooks\/telegram$/);
  });
});
