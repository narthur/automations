import createDatapoint from "src/services/beeminder/createDatapoint.js";
import { getMe } from "src/services/toggl/getMe.js";
import getTimeSummary from "src/services/toggl/getTimeSummary.js";
import type { TogglTimeSummaryGroup } from "src/services/toggl/types.js";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { update } from "./techtainment.js";

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

describe("techtainment", () => {
  beforeEach(() => {
    vi.mocked(getMe).mockResolvedValue({
      id: 1,
      default_workspace_id: 7,
    } as any);

    loadTimeSummary({
      sub_groups: [SUB_GROUP],
    });
  });

  it("sets daystamp", async () => {
    await update();

    expect(createDatapoint).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      expect.objectContaining({
        daystamp: expect.stringMatching(/^\d\d\d\d-\d\d-\d\d$/),
      })
    );
  });

  it("sets request ID", async () => {
    await update();

    expect(createDatapoint).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      expect.objectContaining({
        requestid: expect.stringMatching(/^\d\d\d\d-\d\d-\d\d$/),
      })
    );
  });

  it("adds datapoints to techtainment goal", async () => {
    await update();

    expect(createDatapoint).toHaveBeenCalledWith(
      expect.anything(),
      "techtainment",
      expect.anything()
    );
  });

  it("gets me", async () => {
    await update();

    expect(getMe).toBeCalled();
  });

  it("uses getProjectsSummary to calculate value", async () => {
    await update();

    expect(createDatapoint).toHaveBeenCalledWith(
      expect.anything(),
      "techtainment",
      expect.objectContaining({
        value: -2,
      })
    );
  });

  it("does not specify billable when getting time summary", async () => {
    await update();

    expect(getTimeSummary).not.toHaveBeenCalledWith(
      expect.objectContaining({
        billable: expect.anything(),
      })
    );
  });

  it("only retrieves summary for me", async () => {
    await update();

    expect(getTimeSummary).toHaveBeenCalledWith(
      expect.objectContaining({
        userIds: [1],
      })
    );
  });

  it("uses summary to calculate value", async () => {
    loadTimeSummary({
      sub_groups: [SUB_GROUP, SUB_GROUP],
    });

    await update();

    expect(createDatapoint).toHaveBeenCalledWith(
      expect.anything(),
      "techtainment",
      expect.objectContaining({
        value: -4,
      })
    );
  });
});
