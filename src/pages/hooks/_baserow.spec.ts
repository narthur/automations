import { listRows } from "baserow-sdk";
import createDatapoint from "src/services/beeminder/createDatapoint";
import { describe, expect, it, vi } from "vitest";

import { POST } from "./baserow";

vi.mock("../../goals/bm");

describe("baserow webhook", () => {
  it("updates gross goal", async () => {
    vi.mocked(listRows).mockResolvedValue([]);

    await POST();

    expect(createDatapoint).toBeCalledWith(
      "narthur",
      "gross",
      expect.anything()
    );
  });
});
