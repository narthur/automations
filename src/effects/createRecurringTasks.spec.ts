import { createTask } from "../services/taskratchet.js";
import createRecurringTasks from "./createRecurringTasks.js";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

function run() {
  return (createRecurringTasks as any)();
}

describe("reratchet", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2021-01-01T00:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("creates task for next Sunday", async () => {
    await run();

    expect(createTask).toBeCalledWith(
      expect.any(String),
      "1/3/2021, 11:59 PM",
      expect.any(Number)
    );
  });

  it("creates task for making grocery list", async () => {
    await run();

    expect(createTask).toBeCalledWith(
      expect.stringContaining("Make grocery list"),
      expect.any(String),
      expect.any(Number)
    );
  });
});
