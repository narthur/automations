import getDatapoints from "src/services/beeminder/getDatapoints";
import { describe, expect, it } from "vitest";

import { GET } from "./techtainment";

describe("techtainment", () => {
  it("runs techtainment", async () => {
    await GET();

    expect(getDatapoints).toHaveBeenCalled();
  });
});
