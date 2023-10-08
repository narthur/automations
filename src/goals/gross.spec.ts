import { describe, it, expect, vi } from "vitest";
import { getMe } from "../services/toggl/index.js";
import { createDatapoint } from "../services/beeminder.js";
import { update } from "./gross.js";
import uniq from "src/transforms/uniq.js";
import getTimeSummary from "src/services/toggl/getTimeSummary.js";
import { TogglTimeSummaryGroup } from "src/services/toggl/types.js";

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

  it.only("works", async () => {
    vi.mocked(getMe).mockResolvedValue({ id: 3 } as any);

    vi.mocked(getTimeSummary).mockResolvedValue({
      groups: [
        {
          id: 3,
          sub_groups: [
            {
              rates: [
                {
                  billable_seconds: 840,
                  hourly_rate_in_cents: 5000,
                },
              ],
            },
            {
              rates: [
                {
                  billable_seconds: 4235,
                  hourly_rate_in_cents: 5000,
                },
              ],
            },
            {
              rates: [
                {
                  billable_seconds: 1042,
                  hourly_rate_in_cents: 5000,
                },
              ],
            },
            {
              rates: [
                {
                  billable_seconds: 12360,
                  hourly_rate_in_cents: 3339,
                },
              ],
            },
            {
              rates: [
                {
                  billable_seconds: 1005,
                  hourly_rate_in_cents: 3339,
                },
              ],
            },
          ],
        },
        {
          id: 5,
          sub_groups: [
            {
              rates: [
                {
                  billable_seconds: 4731,
                  hourly_rate_in_cents: 2500,
                },
              ],
            },
            {
              rates: [
                {
                  billable_seconds: 5216,
                  hourly_rate_in_cents: 2500,
                },
              ],
            },
            {
              rates: [
                {
                  billable_seconds: 3527,
                  hourly_rate_in_cents: 2500,
                },
              ],
            },
          ],
        },
      ],
    } as any);

    await update();

    console.dir(vi.mocked(createDatapoint).mock.calls[0], { depth: null });

    expect(createDatapoint).toBeCalledWith(
      "narthur",
      "gross",
      expect.objectContaining({
        value: 236.98954166666664,
      })
    );
  });
});
