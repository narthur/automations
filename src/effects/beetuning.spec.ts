import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import beetuning from "./beetuning.js";
import { GoalExtended, getGoals } from "src/services/beeminder.js";

function loadGoals(goals: Partial<GoalExtended>[]) {
  vi.mocked(getGoals).mockResolvedValue(goals as any);
}

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
    loadGoals([
      {
        slug: "first-goal",
        losedate: new Date("2021-01-02T00:00:00.000Z").getTime() / 1000,
      },
    ]);

    const r = await beetuning();

    expect(r).toContain("first-goal");
  });

  it("sends user all due goals", async () => {
    loadGoals([
      {
        slug: "first-goal",
        losedate: new Date("2021-01-02T00:00:00.000Z").getTime() / 1000,
      },
      {
        slug: "second-goal",
        losedate: new Date("2021-01-03T00:00:00.000Z").getTime() / 1000,
      },
    ]);

    const r = await beetuning();

    expect(r).toContain("first-goal");
    expect(r).toContain("second-goal");
  });

  it("links goals", async () => {
    loadGoals([
      {
        slug: "first-goal",
        losedate: new Date("2021-01-02T00:00:00.000Z").getTime() / 1000,
        url: "the_url",
      },
    ]);

    const r = await beetuning();

    expect(r).toContain("the_url");
  });

  it("includes due date and time", async () => {
    loadGoals([
      {
        slug: "first-goal",
        losedate: new Date("2021-01-02T00:00:00.000Z").getTime() / 1000,
        url: "the_url",
      },
    ]);

    const r = await beetuning();

    expect(r).toContain("1/1/2021");
  });
});
