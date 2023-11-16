import getGoals from "src/services/beeminder/getGoals.js";
import { type Goal } from "src/services/beeminder/types/goal.js";
import { describe, expect, it, vi } from "vitest";

import getBeemergencySummary from "./getBeemergencySummary.js";

describe("getBeemergencySummary", () => {
  it("pads beemergencies", async () => {
    const goals: Partial<Goal>[] = [
      {
        slug: "test",
        safebuf: 0,
        limsum: "LIMSUM",
      },
      {
        slug: "test2",
        safebuf: 0,
        limsum: "LIMSUM",
      },
    ];

    vi.mocked(getGoals).mockResolvedValue(goals as any);

    const response = await getBeemergencySummary();

    expect(response).toContain("test   LIMSUM");
  });

  it("includes stakes", async () => {
    const goals: Partial<Goal>[] = [
      {
        slug: "test",
        safebuf: 0,
        limsum: "LIMSUM",
        pledge: 10,
        rate: 1,
      },
    ];

    vi.mocked(getGoals).mockResolvedValue(goals as any);

    const response = await getBeemergencySummary();

    expect(response).toContain("$10");
  });
});
