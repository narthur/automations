import uniq from "src/lib/uniq.js";
import createDatapoint from "src/services/beeminder/createDatapoint.js";
import getTimeSummary from "src/services/toggl/getTimeSummary.js";
import { type TogglTimeSummaryGroup } from "src/services/toggl/types.js";
import { describe, expect, it, vi } from "vitest";

import { getMe } from "src/services/toggl/getMe.js";
import { update } from "./gross.js";

const SUB_GROUP = {
  id: null,
  title: "the_title",
  seconds: 3600,
  rates: [
    {
      billable_seconds: 3600,
      hourly_rate_in_cents: 100,
      currency: "USD",
    },
  ],
};

function loadTimeSummary(group: Partial<TogglTimeSummaryGroup> = {}) {
  vi.mocked(getTimeSummary).mockResolvedValue({
    groups: [
      {
        id: 3,
        sub_groups: [],
        ...group,
      },
    ],
  });
}

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

  it("groups by user", async () => {
    await update();

    expect(getTimeSummary).toBeCalledWith(
      expect.objectContaining({
        grouping: "users",
      })
    );
  });

  it("sums main user entries", async () => {
    vi.mocked(getMe).mockResolvedValue({
      id: 3,
      default_workspace_id: 1,
    } as any);

    loadTimeSummary({
      sub_groups: [SUB_GROUP],
    });

    await update();

    expect(createDatapoint).toBeCalledWith(
      "narthur",
      "gross",
      expect.objectContaining({
        value: 1,
      })
    );
  });

  it("sums sub user entries", async () => {
    vi.mocked(getMe).mockResolvedValue({
      id: 3,
      default_workspace_id: 1,
    } as any);

    loadTimeSummary({
      id: 5,
      sub_groups: [SUB_GROUP],
    });

    await update();

    expect(createDatapoint).toBeCalledWith(
      "narthur",
      "gross",
      expect.objectContaining({
        value: 0.3,
      })
    );
  });

  it("gets me only once", async () => {
    await update();

    expect(getMe).toBeCalledTimes(1);
  });

  it("sums multiple sub_groups", async () => {
    vi.mocked(getMe).mockResolvedValue({
      id: 3,
      default_workspace_id: 1,
    } as any);

    loadTimeSummary({
      sub_groups: [SUB_GROUP, SUB_GROUP],
    });

    await update();

    expect(createDatapoint).toBeCalledWith(
      "narthur",
      "gross",
      expect.objectContaining({
        value: 2,
      })
    );
  });
});
