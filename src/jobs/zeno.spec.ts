import { describe, it, vi, beforeEach, afterEach, expect } from "vitest";
import zeno from "./zeno.js";
import { deleteMessage, sendMessage } from "../services/telegram/index.js";
import { TelegramMessage } from "src/services/telegram/types/TelegramMessage.js";
import getGoals from "src/services/beeminder/getGoals.js";
import { GoalExtended } from "src/services/beeminder/types/goalExtended.js";

describe("zeno", () => {
  beforeEach(() => {
    vi.useFakeTimers();

    vi.setSystemTime(0);

    vi.mocked(getGoals).mockResolvedValue([
      {
        slug: "foo",
        safebuf: 0,
        losedate: 10,
      } as GoalExtended,
    ]);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("sends alerts", async () => {
    await zeno();

    expect(sendMessage).toBeCalled();
  });

  it("stores and deletes last notification message", async () => {
    const m = {
      message_id: 123,
      chat: {
        id: 456,
      },
    } as TelegramMessage;

    vi.mocked(sendMessage).mockResolvedValue(m);

    await zeno();
    await zeno();

    expect(deleteMessage).toBeCalled();
  });

  it("recovers from failed delete", () => {
    vi.mocked(deleteMessage).mockRejectedValueOnce(new Error("foo"));

    expect(zeno).not.toThrow();
  });
});
