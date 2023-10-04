import { describe, it, expect, vi } from "vitest";
import { getProjects, getTimeEntries } from "../services/toggl/index.js";
import { createDatapoint } from "../services/beeminder.js";
import { update } from "./gross.js";
import uniq from "src/transforms/uniq.js";

describe("gross", () => {
  it("gets time entries", async () => {
    await update();

    expect(getTimeEntries).toBeCalled();
  });

  it("gets projects", async () => {
    await update();

    expect(getProjects).toBeCalled();
  });

  it("posts to gross goal", async () => {
    vi.mocked(getTimeEntries).mockResolvedValue([
      {
        project_id: 7,
        description: "bar",
        duration: 3600,
        billable: true,
      } as any,
    ]);

    vi.mocked(getProjects).mockResolvedValue([
      {
        id: 7,
        billable: true,
        rate: 1,
        active: true,
      } as any,
    ]);

    await update();

    expect(createDatapoint).toBeCalledWith(
      "narthur",
      "gross",
      expect.objectContaining({
        value: 1,
      })
    );
  });

  it("fetches only time entries for current day", async () => {
    await update();

    expect(getTimeEntries).toBeCalledWith(
      expect.objectContaining({
        params: expect.objectContaining({
          start_date: expect.stringMatching(/^\d\d\d\d-\d\d-\d\d$/),
          end_date: expect.stringMatching(/^\d\d\d\d-\d\d-\d\d$/),
        }),
      })
    );
  });

  it("sets requestid to daystamp", async () => {
    vi.mocked(getTimeEntries).mockResolvedValue([
      {
        project_id: 7,
        description: "bar",
        duration: 3600,
        billable: true,
      } as any,
    ]);

    vi.mocked(getProjects).mockResolvedValue([
      {
        id: 7,
        billable: true,
        rate: 1,
        active: true,
      } as any,
    ]);

    await update();

    expect(createDatapoint).toBeCalledWith(
      "narthur",
      "gross",
      expect.objectContaining({
        requestid: expect.stringMatching(/^\d\d\d\d-\d\d-\d\d$/),
      })
    );
  });

  it("does not count negative durations", async () => {
    vi.mocked(getTimeEntries).mockResolvedValue([
      {
        project_id: 7,
        description: "bar",
        duration: -3600,
        billable: true,
      } as any,
    ]);

    vi.mocked(getProjects).mockResolvedValue([
      {
        id: 7,
        billable: true,
        rate: 1,
        active: true,
      } as any,
    ]);

    await update();

    expect(createDatapoint).toBeCalledWith(
      "narthur",
      "gross",
      expect.objectContaining({
        value: 0,
      })
    );
  });

  it("does not include non-billable time entries", async () => {
    vi.mocked(getTimeEntries).mockResolvedValue([
      {
        project_id: 7,
        description: "bar",
        duration: 3600,
        billable: false,
      } as any,
    ]);

    vi.mocked(getProjects).mockResolvedValue([
      {
        id: 7,
        billable: true,
        rate: 1,
        active: true,
      } as any,
    ]);

    await update();

    expect(createDatapoint).toBeCalledWith(
      "narthur",
      "gross",
      expect.objectContaining({
        value: 0,
      })
    );
  });

  it("runs for previous week", async () => {
    await update();

    expect(createDatapoint).toBeCalledTimes(7);
  });

  it("only gets projects once", async () => {
    await update();

    expect(getProjects).toBeCalledTimes(1);
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
