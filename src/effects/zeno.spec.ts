import { describe, it, vi, beforeEach, afterEach, expect } from "vitest";
import zeno from "./zeno.js";
import { getGoals } from "../services/beeminder.js";
import { Goal } from "../services/beeminder.types.js";
import { deleteMessage, sendMessage } from "../services/telegram.js";
import { TelegramMessage } from "../services/telegram.types.js";

function run(): Promise<void> {
  return (zeno as any)();
}

describe("zeno", () => {
  beforeEach(() => {
    vi.useFakeTimers();

    vi.setSystemTime(0);

    vi.mocked(getGoals).mockResolvedValue([
      {
        slug: "foo",
        safebuf: 0,
        losedate: 10,
      } as Goal,
    ]);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("sends alerts", async () => {
    await run();

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

    await run();
    await run();

    expect(deleteMessage).toBeCalled();
  });

  it("recovers from failed delete", () => {
    vi.mocked(deleteMessage).mockRejectedValueOnce(new Error("foo"));

    expect(run).not.toThrow();
  });
});
