import runCommand from "../lib/runCommand.js";
import { expect, it, describe } from "vitest";

describe("today", () => {
  it("returns response", async () => {
    expect(await runCommand("/today")).toEqual([expect.any(String)]);
  });
});
