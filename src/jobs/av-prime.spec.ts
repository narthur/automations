import { beforeEach, describe, expect, it, vi } from "vitest";
import avPrime from "./av-prime.js";
import {
  getClients,
  getProjects,
  getTimeEntries,
} from "../services/toggl/index.js";
import createDatapoint from "src/services/beeminder/createDatapoint.js";

const CLIENT_MATCH_ID = 3;

describe("av-prime", () => {
  beforeEach(() => {
    vi.mocked(getTimeEntries).mockResolvedValue([
      {
        tags: ["prime"],
        project_id: 1,
        duration: 3600 / 2,
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
        name: "__SECRET_TOGGL_CLIENT_AV__",
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

    await avPrime();

    expect(getClients).not.toHaveBeenCalled();
  });

  it("does not get projects if no prime entries", async () => {
    vi.mocked(getTimeEntries).mockResolvedValue([
      {
        tags: [],
        project_id: 1,
      } as any,
    ]);

    await avPrime();

    expect(getProjects).not.toHaveBeenCalled();
  });

  it("sets start and end dates", async () => {
    await avPrime();

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
    await avPrime();

    expect(createDatapoint).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      expect.objectContaining({
        daystamp: expect.stringMatching(/^\d\d\d\d-\d\d-\d\d$/),
      })
    );
  });

  it("sets request ID", async () => {
    await avPrime();

    expect(createDatapoint).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      expect.objectContaining({
        requestid: expect.stringMatching(/^\d\d\d\d-\d\d-\d\d$/),
      })
    );
  });

  it("adds datapoints to techtainment goal", async () => {
    await avPrime();

    expect(createDatapoint).toHaveBeenCalledWith(
      expect.anything(),
      "techtainment",
      expect.anything()
    );
  });

  it("calculates techtainment value correctly", async () => {
    await avPrime();

    expect(createDatapoint).toHaveBeenCalledWith(
      expect.anything(),
      "techtainment",
      expect.objectContaining({ value: -1 })
    );
  });
});
