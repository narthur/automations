import { createTask, getTasks } from "src/services/taskratchet.js";
import { getProject } from "src/services/toggl/getProject.js";
import { beforeEach, describe, expect, it, vi } from "vitest";

import createSummaryTask from "./createSummaryTask.js";

const makeEvent = (payload: Record<string, unknown> = {}) => {
  return {
    payload: {
      id: 1,
      description: "the_description",
      workspace_id: 7,
      project_id: 3,
      // New York time: Dec 31, 2020, 7:00:00 PM
      stop: "2021-01-01T00:00:00.000Z",
      ...payload,
    },
  };
};

describe("createSummaryTask", () => {
  beforeEach(() => {
    vi.mocked(getTasks).mockResolvedValue([]);

    vi.mocked(getProject).mockResolvedValue({
      name: "the_project_name",
    } as any);
  });

  it("gets taskratchet tasks", async () => {
    await createSummaryTask(makeEvent());

    expect(getTasks).toBeCalled();
  });

  it("creates task", async () => {
    await createSummaryTask(makeEvent());

    expect(createTask).toBeCalled();
  });

  it("uses Toggl event description", async () => {
    await createSummaryTask(makeEvent());

    expect(createTask).toBeCalledWith(
      expect.stringMatching(/the_description/),
      expect.any(String),
      expect.any(Number)
    );
  });

  it("does not create task for running time entry", async () => {
    await createSummaryTask(makeEvent({ stop: null }));

    expect(createTask).not.toBeCalled();
  });

  it("includes id in task description", async () => {
    await createSummaryTask(makeEvent());

    expect(createTask).toBeCalledWith(
      expect.stringMatching(/#togglId=1/),
      expect.any(String),
      expect.any(Number)
    );
  });

  it('does not create task if description is "Summary"', async () => {
    await createSummaryTask(
      makeEvent({
        description: "Summary",
      })
    );

    expect(createTask).not.toBeCalled();
  });

  it("does not create task if task already exists", async () => {
    vi.mocked(getTasks).mockResolvedValue([
      {
        id: "1",
        task: "the_description #togglId=1",
        due: "2021-01-01T00:00:00.000Z",
        due_timestamp: 0,
        cents: 100,
        complete: false,
        status: "pending",
        timezone: "America/New_York",
      },
    ] as any);

    await createSummaryTask(makeEvent());

    expect(createTask).not.toBeCalled();
  });

  it("sets due date one hour from entry stop time", async () => {
    await createSummaryTask(makeEvent());

    expect(createTask).toBeCalledWith(
      expect.any(String),
      "12/31/2020, 8:00 PM",
      expect.any(Number)
    );
  });

  it("gets project", async () => {
    await createSummaryTask(makeEvent());

    expect(getProject).toBeCalledWith(7, 3);
  });

  it("includes project name in task description", async () => {
    await createSummaryTask(makeEvent());

    expect(createTask).toBeCalledWith(
      expect.stringMatching(/#project="the_project_name"/),
      expect.any(String),
      expect.any(Number)
    );
  });

  it("sets due date to 30 minutes if no description provided", async () => {
    await createSummaryTask(makeEvent({ description: "" }));

    expect(createTask).toBeCalledWith(
      expect.any(String),
      "12/31/2020, 7:30 PM",
      expect.any(Number)
    );
  });

  it("includes description placeholder when none provided", async () => {
    await createSummaryTask(makeEvent({ description: "" }));

    expect(createTask).toBeCalledWith(
      expect.stringContaining("[no description]"),
      expect.any(String),
      expect.any(Number)
    );
  });
});
