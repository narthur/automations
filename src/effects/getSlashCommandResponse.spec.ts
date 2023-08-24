import { getPendingTasks } from "../services/taskratchet";
import { getGoals } from "../services/beeminder";
import getSlashCommandResponse from "./getSlashCommandResponse";
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../services/beeminder");

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
