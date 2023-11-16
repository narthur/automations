import getTimeSummary from "src/services/toggl/getTimeSummary";
import { describe, expect, it } from "vitest";

import { GET } from "./gross";

describe("gross", () => {
  it("runs gross", async () => {
    const res = await GET();

    expect(res.status).toBe(200);
    expect(await res.text()).toBe("OK");

    expect(getTimeSummary).toBeCalled();
  });
});
