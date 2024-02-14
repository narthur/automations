import createDatapoint from "src/services/beeminder/createDatapoint";
import getGoal from "src/services/beeminder/getGoal";
import { getDocument, getFiles } from "src/services/dynalist";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { update } from "./dynanew";

describe("dynanew", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(0);

    vi.mocked(getGoal).mockResolvedValue({
      deadline: 0,
    } as any);

    vi.mocked(getFiles).mockResolvedValue({
      files: [
        {
          type: "document",
        },
      ],
    } as any);

    vi.mocked(getDocument).mockResolvedValue({
      nodes: [
        {
          created: 0,
        },
      ],
    } as any);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("gets dynanew goal", async () => {
    await update();

    expect(getGoal).toBeCalled();
  });

  it("updates dynanew goal", async () => {
    await update();

    expect(createDatapoint).toBeCalledWith(
      expect.anything(),
      expect.anything(),
      expect.objectContaining({
        value: 1,
        daystamp: "1969-12-31",
      })
    );
  });

  it("respects deadline", async () => {
    vi.mocked(getGoal).mockResolvedValue({
      deadline: -1,
    } as any);

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
