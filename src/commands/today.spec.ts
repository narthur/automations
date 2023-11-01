import { getDueTasks } from "src/services/taskratchet.js";
import runCommand from "../lib/runCommand.js";
import { expect, it, describe } from "vitest";

describe("today", () => {
  it("returns response", async () => {
    expect(await runCommand("/today")).toEqual([expect.any(String)]);
  });

  it("gets TaskRatchet tasks", async () => {
    await runCommand("/today");

    expect(getDueTasks).toBeCalled();
  });
});
