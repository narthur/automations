import { getPendingTasks } from "../services/taskratchet.js";
import { getGoals } from "../services/beeminder.js";
import runCommand from "./runCommand.js";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { getTimeEntries } from "src/services/toggl/index.js";

describe("runCommand", () => {
  beforeEach(() => {
    vi.mocked(getGoals).mockResolvedValue([]);
  });

  it("foobars", async () => {
    expect(await runCommand("/foo")).toEqual(["bar"]);
  });

  it("returns time", async () => {
    expect(await runCommand("/time")).toEqual([
      expect.stringContaining("The time is"),
    ]);
  });

  it("returns false for unsupported message", async () => {
    expect(await runCommand("unsupported")).toEqual(false);
  });

  it("gets beemergencies", async () => {
    const r = await runCommand("/beemergencies");

    expect(r).toEqual([expect.stringContaining("No beemergencies!")]);
  });

  it("queries beeminder for beemergencies", async () => {
    await runCommand("/beemergencies");

    expect(getGoals).toBeCalled();
  });

  it("queries taskratchet", async () => {
    await runCommand("/taskratchet pending");

    expect(getPendingTasks).toBeCalled();
  });

  it("generates invoices", async () => {
    await runCommand("/invoice");

    expect(getTimeEntries).toBeCalled();
  });

  it("gets beetuning links", async () => {
    await runCommand("/beetuning");

    expect(getGoals).toBeCalled();
  });
});
