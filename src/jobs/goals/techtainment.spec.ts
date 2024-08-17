import createDatapoint from "src/services/beeminder/createDatapoint.js";
import getDatapoints from "src/services/beeminder/getDatapoints.js";
import refreshGoal from "src/services/beeminder/refreshGoal.js";
import type { Datapoint } from "src/services/beeminder/types/datapoint.js";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { update } from "./techtainment.js";

function loadDatapoints(
  goalPoints: { slug: string; points: Partial<Datapoint>[] }[]
): void {
  vi.mocked(getDatapoints).mockImplementation((user, goal) => {
    const points = goalPoints.find((g) => g.slug === goal)?.points ?? [];
    return points as any;
  });
}

describe("techtainment", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2021-01-05"));

    loadDatapoints([
      {
        slug: "zone",
        points: [
          {
            id: "1",
            daystamp: "20210101",
            value: 60,
          },
          {
            id: "1",
            daystamp: "20210102",
            value: 120,
          },
        ],
      },
      {
        slug: "active",
        points: [
          {
            id: "1",
            daystamp: "20210101",
            value: 60,
          },
          {
            id: "1",
            daystamp: "20210102",
            value: 120,
          },
        ],
      },
    ]);
  });

  it("uses point value", async () => {
    await update();

    expect(createDatapoint).toHaveBeenCalledWith(
      expect.anything(),
      "techtainment",
      expect.objectContaining({
        value: -4,
      })
    );
  });

  it("finds point by date", async () => {
    await update();

    expect(createDatapoint).toHaveBeenCalledWith(
      expect.anything(),
      "techtainment",
      expect.objectContaining({
        requestid: "2021-01-02",
        value: -8,
      })
    );
  });

  it("only gets last 7 datapoints", async () => {
    await update();

    expect(getDatapoints).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      expect.objectContaining({
        count: 7,
      })
    );
  });

  it("refreshes active", async () => {
    await update();

    expect(refreshGoal).toBeCalled();
  });

  it('gets "zone" datapoints', async () => {
    await update();

    expect(getDatapoints).toHaveBeenCalledWith(
      "narthur",
      "zone",
      expect.anything()
    );
  });

  it("refreshes zone", async () => {
    await update();

    expect(refreshGoal).toHaveBeenCalledWith("narthur", "zone");
  });

  it('gets "steps" datapoints', async () => {
    await update();

    expect(getDatapoints).toHaveBeenCalledWith(
      "narthur",
      "steps",
      expect.anything()
    );
  });

  it("uses steps value", async () => {
    loadDatapoints([
      {
        slug: "steps",
        points: [
          {
            id: "1",
            daystamp: "20210101",
            value: 1000,
          },
        ],
      },
    ]);

    await update();

    expect(createDatapoint).toHaveBeenCalledWith(
      expect.anything(),
      "techtainment",
      expect.objectContaining({
        value: -0.14,
      })
    );
  });

  it("limits value precision", async () => {
    loadDatapoints([
      {
        slug: "steps",
        points: [
          {
            id: "1",
            daystamp: "20210101",
            value: 1000,
          },
        ],
      },
    ]);

    await update();

    expect(createDatapoint).toHaveBeenCalledWith(
      expect.anything(),
      "techtainment",
      expect.objectContaining({
        value: -0.14,
      })
    );
  });

  it("limits precision in comment", async () => {
    loadDatapoints([
      {
        slug: "steps",
        points: [
          {
            id: "1",
            daystamp: "20210101",
            value: 1000,
          },
        ],
      },
    ]);

    await update();

    expect(createDatapoint).toHaveBeenCalledWith(
      expect.anything(),
      "techtainment",
      expect.objectContaining({
        comment: expect.stringContaining("0.14"),
      })
    );
  });
});
