import createDatapoint from "src/services/beeminder/createDatapoint.js";
import getDatapoints from "src/services/beeminder/getDatapoints.js";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { update } from "./techtainment.js";

describe("techtainment", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2021-01-05"));
    vi.mocked(getDatapoints).mockResolvedValue([
      {
        id: "1",
        daystamp: "20210101",
        value: 3,
      },
      {
        id: "1",
        daystamp: "20210102",
        value: 5,
      },
    ] as any);
  });

  it("uses point value", async () => {
    await update();

    expect(createDatapoint).toHaveBeenCalledWith(
      expect.anything(),
      "techtainment",
      expect.objectContaining({
        value: 3,
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
        value: 5,
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
});
