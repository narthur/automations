import { describe, it, expect } from "vitest";
import ynab from "./ynab";

describe("ynab", () => {
  it("should be true", () => {
    ynab();
    expect(true).toBe(true);
  });
});
