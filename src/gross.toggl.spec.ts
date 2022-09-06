import { PROJECTS } from "../vitest.setup";
import { describe, it, vi, beforeEach } from "vitest";
import gross from "./gross";
import { __loadResponse } from "axios";
import expectNewPoint from "./lib/test/expectNewPoint";
import loadTimeEntries from "./lib/test/loadTimeEntries";

vi.mock("axios");

describe("gross toggl", () => {
  beforeEach(() => {
    vi.setSystemTime("2022-08-10T17:50:07+00:00");

    __loadResponse({
      method: ["get", "post"],
      payload: { data: [] },
    });
  });

  it("posts day sum", async () => {
    loadTimeEntries([{}]);

    await gross();

    expectNewPoint({ value: 10 });
  });

  it("handles ongoing timers", async () => {
    vi.setSystemTime("2022-08-10T17:50:07+00:00");

    loadTimeEntries([{ duration: -1660150207 }]);

    await gross();

    expectNewPoint({ value: 10 });
  });

  it("includes comment", async () => {
    loadTimeEntries([{}]);

    await gross();

    expectNewPoint({ comment: "Toggl: Project 0: 1hrs" });
  });

  it("filters by project id", async () => {
    loadTimeEntries([{ project_id: "wrong_id" }]);

    await gross();

    expectNewPoint({
      value: 0,
    });
  });

  it("filters by date", async () => {
    vi.setSystemTime("2022-08-10T17:50:07+00:00");

    loadTimeEntries([{}]);

    await gross();

    expectNewPoint({ value: 0 });
  });

  it("maps rates to projects", async () => {
    loadTimeEntries([{ project_id: PROJECTS[1].id }]);

    await gross();

    expectNewPoint({ value: 20 });
  });
});
