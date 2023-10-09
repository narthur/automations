import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { update } from "./dynadone.js";
import getNodes from "src/services/dynalist/getNodes.js";
import { createDatapoint } from "src/services/beeminder.js";

vi.mock("src/services/dynalist/getNodes");

const NOW = new Date("2021-01-01");

const CHECKED = {
  checked: true,
  modified: NOW.getTime(),
};

const UNCHECKED = {
  checked: false,
  modified: NOW.getTime(),
};

describe("dynadone", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
    vi.mocked(getNodes).mockResolvedValue([]);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("gets nodes", async () => {
    await update();

    expect(getNodes).toBeCalled();
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
      "narthur",
      "dynadone",
      expect.objectContaining({
        value: 1,
      })
    );
  });
});
