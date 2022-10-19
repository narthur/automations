import { describe, it, expect, vi, beforeEach } from "vitest";
import getGoal from "./lib/bm/getGoal";
import techtainment from "./techtainment";
import createDatapoint from "./lib/bm/createDatapoint";
import { Datapoint, Goal } from "./lib/bm/types";

vi.mock("./lib/bm/getGoal");
vi.mock("./lib/bm/createDatapoint");

function loadDatapoints(
  datapoints: Partial<Datapoint>[] = [
    {
      daystamp: "20210101",
      value: 1,
    },
  ]
) {
  vi.mocked(getGoal).mockResolvedValue({ datapoints } as Goal);
}

function expectValue(value: number) {
  expect(createDatapoint).toBeCalledWith(
    "narthur",
    "techtainment",
    expect.objectContaining({
      value,
    })
  );
}

describe("techtainment", () => {
  beforeEach(() => {
    vi.setSystemTime(new Date("2021-01-01T00:00:00.000Z"));
    loadDatapoints();
    vi.mocked(createDatapoint).mockClear();
  });

  it("gets exercise Beeminder goal", async () => {
    await techtainment();

    expect(getGoal).toBeCalledWith("narthur", "exercise");
  });

  it("creates techtainment datapoint", async () => {
    await techtainment();

    expectValue(-2);
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
    loadDatapoints([
      {
        daystamp: "20210101",
        value: 3,
      },
    ]);

    await techtainment();

    expectValue(-6);
  });

  it("sums day values", async () => {
    loadDatapoints([
      {
        daystamp: "20210101",
        value: 1,
      },
      {
        daystamp: "20210101",
        value: 2,
      },
    ]);

    await techtainment();

    expectValue(-6);
  });

  it("only creates datapoints for last 7 days", async () => {
    loadDatapoints([
      {
        daystamp: "20200101",
        value: 1,
      },
    ]);

    await techtainment();

    expect(createDatapoint).not.toBeCalled();
  });
});
