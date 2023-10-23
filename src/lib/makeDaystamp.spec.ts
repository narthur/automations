import makeDaystamp from "./makeDaystamp.js";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const NOW = new Date("2021-01-01T00:00:01-04:00");

describe("makeDaystamp", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("respects timezone", () => {
    const daystamp = makeDaystamp(NOW);
    expect(daystamp).toBe("2020-12-31");
  });
});
