import createDatapoint from "src/services/beeminder/createDatapoint";
import { describe, expect, it } from "vitest";

import { POST } from "./tr-email-zero";

describe("email-zero", () => {
  it("creates datapoint", async () => {
    const request = new Request("https://example.com/goals/tr-email-zero", {
      method: "POST",
      body: JSON.stringify({
        count: 0,
      }),
    });

    await POST({ request } as any);

    expect(createDatapoint).toBeCalled();
  });
});
