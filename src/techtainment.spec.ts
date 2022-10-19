import { describe, it, expect, vi, beforeEach } from "vitest";
import getGoal from "./lib/bm/getGoal";
import techtainment from "./techtainment";
import createDatapoint from "./lib/bm/createDatapoint";
import { Goal } from "./lib/bm/types";

vi.mock("./lib/bm/getGoal");
vi.mock("./lib/bm/createDatapoint");

describe("techtainment", () => {
  beforeEach(() => {
    vi.setSystemTime(new Date("2021-01-01T00:00:00.000Z"));
    vi.mocked(getGoal).mockResolvedValue({
      datapoints: [
        {
          daystamp: "20210101",
          value: 1,
        },
      ],
    } as Goal);
  });

  it("gets exercise Beeminder goal", async () => {
    await techtainment();

    expect(getGoal).toBeCalledWith("narthur", "exercise");
  });

  it("creates techtainment datapoint", async () => {
    await techtainment();

    expect(createDatapoint).toBeCalledWith(
      "narthur",
      "techtainment",
      expect.objectContaining({
        value: -2,
      })
    );
  });

  it("sets request id", async () => {
    await techtainment();

    expect(createDatapoint).toBeCalledWith(
      "narthur",
      "techtainment",
      expect.objectContaining({
        requestid: expect.stringMatching(/20210101/),
      })
    );
  });

  it("sets comment", async () => {
    await techtainment();

    expect(createDatapoint).toBeCalledWith(
      "narthur",
      "techtainment",
      expect.objectContaining({
        comment: expect.stringMatching(/exercise/),
      })
    );
  });

  it("calculates value accurately", async () => {
    vi.mocked(getGoal).mockResolvedValue({
      datapoints: [
        {
          daystamp: "20210101",
          value: 3,
        },
      ],
    } as Goal);

    await techtainment();

    expect(createDatapoint).toBeCalledWith(
      "narthur",
      "techtainment",
      expect.objectContaining({
        value: -6,
      })
    );
  });

  it("sums day values", async () => {
    vi.mocked(getGoal).mockResolvedValue({
      datapoints: [
        {
          daystamp: "20210101",
          value: 1,
        },
        {
          daystamp: "20210101",
          value: 2,
        },
      ],
    } as Goal);

    await techtainment();

    expect(createDatapoint).toBeCalledWith(
      "narthur",
      "techtainment",
      expect.objectContaining({
        value: -6,
      })
    );
  });
});
