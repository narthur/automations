import { createTask } from "../services/taskratchet";
import { reratchet_cron } from "./reratchet";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

function run() {
  return (reratchet_cron as any)();
}

describe("reratchet", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2021-01-01T00:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("creates task for next Saturday", async () => {
    await run();

    expect(createTask).toBeCalledWith(
      expect.any(String),
      "1/2/2021, 11:59 PM",
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
