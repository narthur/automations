import createDatapoint from "src/services/beeminder/createDatapoint.js";
import getProjectsSummary from "src/services/toggl/getProjectsSummary.js";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { getMe } from "../services/toggl/index.js";
import { update } from "./techtainment.js";

describe("techtainment", () => {
  beforeEach(() => {
    vi.mocked(getMe).mockResolvedValue({
      id: 1,
      default_workspace_id: 7,
    } as any);

    vi.mocked(getProjectsSummary).mockResolvedValue([
      {
        user_id: 1,
        project_id: 1,
        tracked_seconds: 3600,
        billable_seconds: 3600,
      },
    ]);
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

  it("gets projects summary", async () => {
    await update();

    expect(getProjectsSummary).toBeCalled();
  });

  it("gets me", async () => {
    await update();

    expect(getMe).toBeCalled();
  });

  it("uses me.default_workspace_id as workspace ID", async () => {
    await update();

    expect(getProjectsSummary).toHaveBeenCalledWith(
      expect.objectContaining({
        workspaceId: 7,
      })
    );
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

  it("only uses project with highest tracked seconds", async () => {
    vi.mocked(getProjectsSummary).mockResolvedValue([
      {
        user_id: 1,
        project_id: 1,
        tracked_seconds: 3600,
        billable_seconds: 3600,
      },
      {
        user_id: 1,
        project_id: 2,
        tracked_seconds: 7200,
        billable_seconds: 7200,
      },
    ]);

    await update();

    expect(createDatapoint).toHaveBeenCalledWith(
      expect.anything(),
      "techtainment",
      expect.objectContaining({
        value: -4,
      })
    );
  });

  it("includes project id in comment", async () => {
    await update();

    expect(createDatapoint).toHaveBeenCalledWith(
      expect.anything(),
      "techtainment",
      expect.objectContaining({
        comment: expect.stringContaining("1"),
      })
    );
  });

  it("uses date object to get projects summary", async () => {
    await update();

    expect(getProjectsSummary).toHaveBeenCalledWith(
      expect.objectContaining({
        start: expect.any(Date),
        end: expect.any(Date),
      })
    );
  });
});
