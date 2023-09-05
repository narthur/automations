import { beforeEach, describe, expect, it, vi } from "vitest";
import avPrime from "./av-prime.js";
import {
  getClients,
  getProjects,
  getTimeEntries,
} from "../services/toggl/index.js";
import { createDatapoint } from "../services/beeminder.js";

vi.mock("src/services/beeminder");

const CLIENT_MATCH_ID = 3;
const CLIENT_MISS_ID = 2;

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

  it("gets time entries", async () => {
    await avPrime();

    expect(getTimeEntries).toHaveBeenCalled();
  });

  it("posts to beeminder", async () => {
    await avPrime();

    expect(createDatapoint).toHaveBeenCalled();
  });

  it("posts 1 if specific client time entry is tagged prime", async () => {
    await avPrime();

    expect(createDatapoint).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      expect.objectContaining({ value: 1 })
    );
  });

  it("posts 0 if specific client time entry is not tagged prime", async () => {
    vi.mocked(getTimeEntries).mockResolvedValue([
      {
        tags: [],
        project_id: 1,
      } as any,
    ]);

    await avPrime();

    expect(createDatapoint).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      expect.objectContaining({ value: 0 })
    );
  });

  it("posts 1 if specific client has multiple time entries tagged prime", async () => {
    vi.mocked(getTimeEntries).mockResolvedValue([
      {
        tags: ["prime"],
        project_id: 1,
      } as any,
      {
        tags: ["prime"],
        project_id: 1,
      } as any,
    ]);

    await avPrime();

    expect(createDatapoint).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      expect.objectContaining({ value: 1 })
    );
  });

  it("posts 0 if prime entries are not for specific client", async () => {
    vi.mocked(getProjects).mockResolvedValue([
      {
        id: 1,
        client_id: CLIENT_MISS_ID,
      } as any,
    ]);

    await avPrime();

    expect(createDatapoint).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      expect.objectContaining({ value: 0 })
    );
  });

  it("posts to correct goal", async () => {
    await avPrime();

    expect(createDatapoint).toHaveBeenCalledWith(
      "narthur",
      "audioprime",
      expect.anything()
    );
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
