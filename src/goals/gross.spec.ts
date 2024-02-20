import uniq from "src/lib/uniq.js";
import { TABLES } from "src/services/baserow/constants.js";
import { listRows } from "src/services/baserow/listRows.js";
import createDatapoint from "src/services/beeminder/createDatapoint.js";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { update } from "./gross.js";

describe("gross", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-01-02T12:00:00Z"));
    vi.mocked(listRows).mockResolvedValue([]);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

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

  it("gets entries", async () => {
    await update();

    expect(listRows).toBeCalledWith(
      TABLES.Entries,
      expect.objectContaining({
        filters: expect.objectContaining({
          filters: expect.arrayContaining([
            {
              type: "date_equal",
              field: "End",
              value: "America/Detroit?2024-01-02",
            },
          ]),
        }),
      })
    );
  });

  it("sums value from net field", async () => {
    vi.mocked(listRows).mockResolvedValue([
      { Net: "1.00" },
      { Net: "2.00" },
      { Net: "3.00" },
    ]);

    await update();

    expect(createDatapoint).toBeCalledWith(
      "narthur",
      "gross",
      expect.objectContaining({
        value: 6,
      })
    );
  });
});
