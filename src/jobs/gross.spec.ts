import { describe, it, vi, beforeEach, expect } from "vitest";
import gross from "./gross";
import axios, { __loadResponse } from "axios";
import expectNewPoint from "../test/expectNewPoint";
import loadTimeEntries from "../test/loadTimeEntries";
import loadTogglProjects from "../test/loadTogglProjects";
import { getTimeEntries } from "../services/toggl";
import loadTogglTasks from "../test/loadTogglTasks";

describe("gross toggl", () => {
  beforeEach(() => {
    vi.setSystemTime("2022-08-10T17:50:07+00:00");

    __loadResponse({
      method: ["get", "post"],
      payload: { data: [] },
    });
  });

  it("includes project name in datapoint comment", async () => {
    loadTogglProjects([
      {
        id: 123,
        name: "project_name",
      },
    ]);

    loadTimeEntries([{ project_id: 123, duration: 3600 }]);

    await gross();

    expectNewPoint({ comment: expect.stringMatching(/project_name/) });
  });

  it("sets unique datapoint id", async () => {
    vi.setSystemTime("2022-08-10T17:50:07+00:00");

    loadTogglProjects([
      {
        id: 123,
      },
    ]);

    loadTimeEntries([{ project_id: 123, duration: 3600 }]);

    await gross();

    expectNewPoint({ requestid: "toggl-123-2022-08-10" });
  });

  it("handles hourly projects", async () => {
    loadTogglProjects([{ id: 123, rate: 3 }]);
    loadTimeEntries([{ project_id: 123, duration: 3600 }]);

    await gross();

    expectNewPoint({ value: 3 });
  });

  it("queries time entries by date", async () => {
    vi.setSystemTime("2022-08-10T17:50:07+00:00");

    await gross();

    expect(getTimeEntries).toHaveBeenCalledWith(
      expect.objectContaining({
        params: expect.objectContaining({
          start_date: "2022-08-10",
          end_date: "2022-08-11",
        }),
      })
    );
  });

  it("queries time entries for a week in the past", async () => {
    vi.setSystemTime("2022-08-10T17:50:07+00:00");

    await gross();

    expect(getTimeEntries).toHaveBeenCalledWith(
      expect.objectContaining({
        params: expect.objectContaining({
          start_date: "2022-08-04",
          end_date: "2022-08-05",
        }),
      })
    );
  });

  it("does not post zero-time datapoints", async () => {
    loadTogglProjects([{ id: 123, rate: 3 }]);
    loadTimeEntries([]);

    await gross();

    expect(axios.post).not.toHaveBeenCalled();
  });

  it("sets daystamp", async () => {
    vi.setSystemTime("2022-08-10T17:50:07+00:00");

    loadTogglProjects([{ id: 123, rate: 3 }]);
    loadTimeEntries([{ project_id: 123, duration: 3600 }]);

    await gross();

    expectNewPoint({ daystamp: "20220810" });
  });

  it("ignores non-billable projects", async () => {
    loadTogglProjects([{ id: 123, rate: 3, billable: false }]);
    loadTimeEntries([{ project_id: 123, duration: 3600 }]);

    await gross();

    expect(axios.post).not.toHaveBeenCalled();
  });

  it("ignores archived projects", async () => {
    loadTogglProjects([{ id: 123, rate: 3, active: false }]);
    loadTimeEntries([{ project_id: 123, duration: 3600 }]);

    await gross();

    expect(axios.post).not.toHaveBeenCalled();
  });

  it("correctly includes number of hours in datapoint comment", async () => {
    loadTogglProjects([{ id: 123, rate: 3 }]);
    loadTimeEntries([{ project_id: 123, duration: 3600 }]);

    await gross();

    expectNewPoint({ comment: expect.stringMatching(/1h/) });
  });

  it("uses task estimate to calculate captured value", async () => {
    loadTogglProjects([{ id: 123, fixed_fee: 30, estimated_hours: 10 }]);
    loadTogglTasks([
      {
        estimated_seconds: 3600,
        // tracked_seconds is in milliseconds
        tracked_seconds: (3600 * 1000) / 2,
      },
    ]);

    await gross();

    expectNewPoint({ value: 1.5 });
  });

  it("maintains a single datapoint for each fixed-fee project", async () => {
    loadTogglProjects([{ id: 123, fixed_fee: 30, estimated_hours: 10 }]);
    loadTimeEntries([{ project_id: 123, duration: 3600 }]);

    await gross();

    expectNewPoint({ requestid: "toggl-123-fixed" });
  });

  it("skips fixed-fee projects without a total estimated hours", async () => {
    loadTogglProjects([{ id: 123, fixed_fee: 30 }]);
    loadTimeEntries([{ project_id: 123, duration: 3600 }]);

    await gross();

    expect(axios.post).not.toHaveBeenCalled();
  });

  it("treats entire task value as captured when it is marked inactive (done)", async () => {
    loadTogglProjects([{ id: 123, fixed_fee: 30, estimated_hours: 10 }]);
    loadTogglTasks([
      {
        estimated_seconds: 3600,
        tracked_seconds: (3600 * 1000) / 2,
        active: false,
      },
    ]);

    await gross();

    expectNewPoint({ value: 3 });
  });

  it("rounds number of hours in datapoint comment to 2 decimal places", async () => {
    loadTogglProjects([{ id: 123, rate: 3 }]);
    loadTimeEntries([{ project_id: 123, duration: 3600 }]);

    await gross();

    expectNewPoint({ comment: expect.stringMatching(/1h/) });
  });

  it("rounds captured value to 2 decimal places", async () => {
    loadTogglProjects([{ id: 123, fixed_fee: 30, estimated_hours: 13 }]);
    loadTogglTasks([
      {
        estimated_seconds: 3600,
        tracked_seconds: (3600 * 1000) / 2,
      },
    ]);

    await gross();

    expectNewPoint({ value: 1.15 });
  });

  it("rounds value to 2 decimal places for hourly projects", async () => {
    loadTogglProjects([{ id: 123, rate: 3 }]);
    loadTimeEntries([{ project_id: 123, duration: 2900 }]);

    await gross();

    expectNewPoint({ value: 2.42 });
  });
});
