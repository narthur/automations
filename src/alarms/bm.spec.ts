import getGoals from "src/services/beeminder/getGoals.js";
import { type GoalExtended } from "src/services/beeminder/types/goalExtended.js";
import { type TelegramMessage } from "src/services/telegram/types/TelegramMessage.js";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { deleteMessage, sendMessage } from "../services/telegram/index.js";
import { send } from "./bm.js";

describe("bm", () => {
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
    await send();

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

    await send();
    await send();

    expect(deleteMessage).toBeCalled();
  });

  it("recovers from failed delete", () => {
    vi.mocked(deleteMessage).mockRejectedValueOnce(new Error("foo"));

    expect(send).not.toThrow();
  });
});
