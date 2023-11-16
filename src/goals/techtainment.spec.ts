import createDatapoint from "src/services/beeminder/createDatapoint.js";
import { getProjects } from "src/services/toggl/getProjects.js";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { getClients, getTimeEntries } from "../services/toggl/index.js";
import { update } from "./techtainment.js";

const CLIENT_MATCH_ID = 3;

describe("av-prime", () => {
  beforeEach(() => {
    vi.mocked(getTimeEntries).mockResolvedValue([
      {
        tags: ["prime"],
        project_id: 1,
        duration: 3600 / 2,
        workspace_id: 1,
      } as any,
    ]);

    vi.mocked(getProjects).mockResolvedValue([
      {
        id: 1,
        client_id: CLIENT_MATCH_ID,
      } as any,
    ]);

    vi.mocked(getClients).mockResolvedValue([
      {
        id: CLIENT_MATCH_ID,
        name: "__TOGGL_CLIENT_AV_VALUE__",
      } as any,
    ]);
  });

  it("does not get clients if no prime entries", async () => {
    vi.mocked(getTimeEntries).mockResolvedValue([
      {
        tags: [],
        project_id: 1,
      } as any,
    ]);

    await update();

    expect(getClients).not.toHaveBeenCalled();
  });

  it("sets start and end dates", async () => {
    await update();

    expect(getTimeEntries).toHaveBeenCalledWith(
      expect.objectContaining({
        params: {
          start_date: expect.stringMatching(/^\d\d\d\d-\d\d-\d\d$/),
          end_date: expect.stringMatching(/^\d\d\d\d-\d\d-\d\d$/),
        },
      })
    );
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

  it("calculates techtainment value correctly", async () => {
    await update();

    expect(createDatapoint).toHaveBeenCalledWith(
      expect.anything(),
      "techtainment",
      expect.objectContaining({ value: -1 })
    );
  });

  it("only gets time entries once per day", async () => {
    await update();

    expect(getTimeEntries).toHaveBeenCalledTimes(7);
  });

  it("only gets projects once", async () => {
    await update();

    expect(getProjects).toHaveBeenCalledTimes(1);
  });
});
