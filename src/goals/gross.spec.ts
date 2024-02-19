import uniq from "src/lib/uniq.js";
import createDatapoint from "src/services/beeminder/createDatapoint.js";
import { describe, expect, it, vi } from "vitest";

import { update } from "./gross.js";

describe("gross", () => {
  it("sets requestid to daystamp", async () => {
    await update();

    expect(createDatapoint).toBeCalledWith(
      "narthur",
      "gross",
      expect.objectContaining({
        requestid: expect.stringMatching(/^\d\d\d\d-\d\d-\d\d$/),
      })
    );
  });

  it("sets daystamp to each day of week", async () => {
    await update();

    const daystamps = vi
      .mocked(createDatapoint)
      .mock.calls.map((args) => args[2].daystamp);
    const count = uniq(daystamps).length;

    expect(count).toBe(7);
  });
});
