import { afterEach,beforeEach, describe, expect, it, vi } from "vitest";

import makeDaystamp from "./makeDaystamp.js";

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
