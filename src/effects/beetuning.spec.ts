import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import beetuning from "./beetuning.js";
import { getGoals } from "src/services/beeminder.js";
import { Goal } from "src/services/beeminder.types.js";

describe("beetuning", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2021-01-01T00:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("tells user if no goals are due within two weeks", async () => {
    const r = await beetuning();

    expect(r).toContain("No goals due");
  });

  it("sends user goals", async () => {
    vi.mocked(getGoals).mockResolvedValue([
      {
        slug: "first-goal",
        losedate: new Date("2021-01-02T00:00:00.000Z").getTime() / 1000,
      } as Partial<Goal> as any,
    ]);

    const r = await beetuning();

    expect(r).toContain("first-goal");
  });

  it("sends user all due goals", async () => {
    vi.mocked(getGoals).mockResolvedValue([
      {
        slug: "first-goal",
        losedate: new Date("2021-01-02T00:00:00.000Z").getTime() / 1000,
      } as Partial<Goal> as any,
      {
        slug: "second-goal",
        losedate: new Date("2021-01-03T00:00:00.000Z").getTime() / 1000,
      } as Partial<Goal> as any,
    ]);

    const r = await beetuning();

    expect(r).toContain("first-goal");
    expect(r).toContain("second-goal");
  });

  it("links goals", async () => {
    vi.mocked(getGoals).mockResolvedValue([
      {
        slug: "first-goal",
        losedate: new Date("2021-01-02T00:00:00.000Z").getTime() / 1000,
        url: "the_url",
      } as Partial<Goal> as any,
    ]);

    const r = await beetuning();

    expect(r).toContain("the_url");
  });

  it("includes due date and time", async () => {
    vi.mocked(getGoals).mockResolvedValue([
      {
        slug: "first-goal",
        losedate: new Date("2021-01-02T00:00:00.000Z").getTime() / 1000,
        url: "the_url",
      } as Partial<Goal> as any,
    ]);

    const r = await beetuning();

    expect(r).toContain("1/1/2021");
  });
});