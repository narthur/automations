import { PROJECTS, setEnv } from "../../vitest.setup";
import { describe, it, vi, beforeEach, expect } from "vitest";
import gross from "./gross";
import axios, { __loadResponse } from "axios";
import expectNewPoint from "../lib/test/expectNewPoint";
import loadTimeEntries from "../lib/test/loadTimeEntries";
import loadTogglProjects from "../lib/test/loadTogglProjects";

vi.mock("axios");

describe("gross toggl", () => {
  beforeEach(() => {
    vi.setSystemTime("2022-08-10T17:50:07+00:00");

    __loadResponse({
      method: ["get", "post"],
      payload: { data: [] },
    });
  });

  it("gets projects using toggl auth token", async () => {
    setEnv({
      TOGGL_WORKSPACE_ID: "1",
      TOGGL_API_TOKEN: "the_toggl_api_token",
    });

    await gross();

    const expected = Buffer.from(
      `${process.env.TOGGL_API_TOKEN}:api_token`
    ).toString("base64");

    expect(axios.get).toHaveBeenCalledWith(
      expect.stringMatching(/projects/),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: `Basic ${expected}`,
        }) as unknown,
      })
    );
  });

  it("includes project name in datapoint comment", async () => {
    loadTogglProjects([
      {
        name: "project_name",
      },
    ]);

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

    await gross();

    expectNewPoint({ requestid: "toggl-123-2022-08-10" });
  });

  it("only retrieves billable projects", async () => {
    await gross();

    expect(axios.get).toHaveBeenCalledWith(
      expect.stringMatching(/projects/),
      expect.objectContaining({
        params: expect.objectContaining({ billable: true }),
      })
    );
  });

  it("only retrieves active projects", async () => {
    await gross();

    expect(axios.get).toHaveBeenCalledWith(
      expect.stringMatching(/projects/),
      expect.objectContaining({
        params: expect.objectContaining({ active: true }),
      })
    );
  });

  it("handles hourly projects", async () => {
    loadTogglProjects([{ id: 123, rate: 3 }]);
    loadTimeEntries([{ project_id: 123, duration: 3600 }]);

    await gross();

    expectNewPoint({ value: 3 });
  });

  it("handles fixed bids", async () => {
    loadTogglProjects([{ id: 123, fixed_fee: 30, estimated_hours: 10 }]);
    loadTimeEntries([{ project_id: 123, duration: 3600 }]);

    await gross();

    expectNewPoint({ value: 3 });
  });

  it("queries time entries by date", async () => {
    vi.setSystemTime("2022-08-10T17:50:07+00:00");
    await gross();

    expect(axios.get).toHaveBeenCalledWith(
      expect.stringMatching(/time_entries/),
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

    expect(axios.get).toHaveBeenCalledWith(
      expect.stringMatching(/time_entries/),
      expect.objectContaining({
        params: expect.objectContaining({
          start_date: "2022-08-04",
          end_date: "2022-08-05",
        }),
      })
    );
  });
});
