import getGoals from "src/services/beeminder/getGoals.js";
import { addMessage } from "src/services/openai/addMessage.js";
import { sendMessage } from "src/services/telegram/index.js";
import { beforeEach, describe, expect, it, vi } from "vitest";
import waitForExpect from "wait-for-expect";

import { getPendingTasks } from "../services/taskratchet.js";
import runCommand from "./runCommand.js";

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

  it("gets beetuning links", async () => {
    await runCommand("/beetuning");

    expect(getGoals).toBeCalled();
  });

  it("has test alarm command", async () => {
    const r = await runCommand("/alarm");

    expect(r).toEqual([expect.stringContaining("Test alarm scheduled")]);
  });

  it("sends alarm message", async () => {
    await runCommand("/alarm");

    await waitForExpect(() => {
      expect(sendMessage).toBeCalled();
    });
  });

  it("adds messages to gpt thread", async () => {
    await runCommand("/time");

    expect(addMessage).toBeCalled();
  });
});
