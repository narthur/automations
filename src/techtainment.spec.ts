import { describe, it, expect, vi, beforeEach } from "vitest";
import getGoal from "./lib/bm/getGoal";
import techtainment from "./techtainment";
import createDatapoint from "./lib/bm/createDatapoint";

vi.mock("./lib/bm/getGoal");
vi.mock("./lib/bm/createDatapoint");

describe("techtainment", () => {
  beforeEach(() => {
    vi.mocked(getGoal).mockResolvedValue({
      datapoints: [
        {
          daystamp: "2021-01-01",
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

    expect(createDatapoint).toBeCalledWith("narthur", "techtainment", {
      value: -2,
    });
  });

  it("ignores datapoints for day other than today", async () => {
    await techtainment();

    expect(createDatapoint).not.toBeCalled();
  });
});
