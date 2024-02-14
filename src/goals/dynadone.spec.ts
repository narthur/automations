import createDatapoint from "src/services/beeminder/createDatapoint.js";
import getGoal from "src/services/beeminder/getGoal.js";
import getNodes from "src/services/dynalist/getNodes.js";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { update } from "./dynadone.js";

vi.mock("src/services/dynalist/getNodes");

const CHECKED = {
  checked: true,
  modified: 0,
};

const UNCHECKED = {
  checked: false,
  modified: 0,
};

describe("dynadone", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(0);
    vi.mocked(getNodes).mockResolvedValue([]);
    vi.mocked(getGoal).mockResolvedValue({
      deadline: 0,
    } as any);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("counts completed nodes", async () => {
    vi.mocked(getNodes).mockResolvedValue([CHECKED, CHECKED, CHECKED] as any);

    await update();

    expect(createDatapoint).toBeCalledWith(
      "narthur",
      "dynadone",
      expect.objectContaining({
        value: 3,
      })
    );
  });

  it("does not count unchecked nodes", async () => {
    vi.mocked(getNodes).mockResolvedValue([
      UNCHECKED,
      CHECKED,
      UNCHECKED,
    ] as any);

    await update();

    expect(createDatapoint).toBeCalledWith(
      expect.anything(),
      expect.anything(),
      expect.objectContaining({
        value: 1,
      })
    );
  });

  it("respects deadline", async () => {
    vi.mocked(getGoal).mockResolvedValue({
      deadline: -1,
    } as any);

    vi.mocked(getNodes).mockResolvedValue([CHECKED] as any);

    await update();

    expect(createDatapoint).toBeCalledWith(
      expect.anything(),
      expect.anything(),
      expect.objectContaining({
        value: 0,
        daystamp: "1969-12-31",
      })
    );
  });
});
