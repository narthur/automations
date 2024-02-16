import createDatapoint from "src/services/beeminder/createDatapoint";
import { describe, expect, it } from "vitest";

import { POST } from "./baserow";

describe("baserow webhook", () => {
  it("updates gross goal", async () => {
    await POST();

    expect(createDatapoint).toBeCalledWith(
      "narthur",
      "gross",
      expect.anything()
    );
  });
});
