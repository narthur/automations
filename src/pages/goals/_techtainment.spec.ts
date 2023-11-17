import { getTimeEntries } from "src/services/toggl";
import { describe, expect, it } from "vitest";

import { GET } from "./techtainment";

describe("techtainment", () => {
  it("runs techtainment", async () => {
    await GET();

    expect(getTimeEntries).toHaveBeenCalled();
  });
});
