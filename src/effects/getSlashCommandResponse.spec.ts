import { getPendingTasks } from "../services/taskratchet.js";
import { getGoals } from "../services/beeminder.js";
import getSlashCommandResponse from "./getSlashCommandResponse.js";
import { describe, it, expect, vi, beforeEach } from "vitest";

describe("getSlashCommandResponse", () => {
  beforeEach(() => {
    vi.mocked(getGoals).mockResolvedValue([]);
  });

  it("foobars", async () => {
    expect(await getSlashCommandResponse("/foo")).toEqual(["bar"]);
  });

  it("returns time", async () => {
    expect(await getSlashCommandResponse("/time")).toEqual([
      expect.stringContaining("The time is"),
    ]);
  });

  it("returns false for unsupported message", async () => {
    expect(await getSlashCommandResponse("unsupported")).toEqual(false);
  });

  it("gets beemergencies", async () => {
    const r = await getSlashCommandResponse("/beemergencies");

    expect(r).toEqual([expect.stringContaining("No beemergencies!")]);
  });

  it("queries beeminder for beemergencies", async () => {
    await getSlashCommandResponse("/beemergencies");

    expect(getGoals).toBeCalled();
  });

  it("queries taskratchet", async () => {
    await getSlashCommandResponse("/taskratchet pending");

    expect(getPendingTasks).toBeCalled();
  });
});
