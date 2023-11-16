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
});
