import getSlashCommandResponse from "./getSlashCommandResponse";
import { describe, it, expect } from "vitest";

describe("getSlashCommandResponse", () => {
  it("foobars", () => {
    expect(getSlashCommandResponse("/foo")).toEqual(["bar"]);
  });

  it("returns time", () => {
    expect(getSlashCommandResponse("/time")).toEqual([
      expect.stringContaining("The time is"),
    ]);
  });

  it("returns false for unsupported message", () => {
    expect(getSlashCommandResponse("unsupported")).toEqual(false);
  });
});
