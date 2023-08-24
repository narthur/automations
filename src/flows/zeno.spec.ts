import { describe, it, vi, beforeEach, afterEach, expect } from "vitest";
import { zeno_cron } from "./zeno";
import { getGoals } from "../services/beeminder";
import { Goal } from "../services/beeminder.types";
import { deleteMessage, sendMessage } from "../services/telegram";
import { TelegramMessage } from "../services/telegram.types";
import { getDoc, setDoc } from "../services/firestore";

vi.mock("../services/beeminder");

function run(): Promise<void> {
  return (zeno_cron as any)();
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

    vi.mocked(getDoc).mockResolvedValue({
      chat: {
        id: 123,
      },
      message_id: 456,
    } as TelegramMessage);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("sends alerts", async () => {
    await run();

    expect(sendMessage).toBeCalled();
  });

  it("stores last notification message", async () => {
    const m = {
      message_id: 123,
    } as TelegramMessage;

    vi.mocked(sendMessage).mockResolvedValue(m);

    await run();

    expect(setDoc).toBeCalledWith("meta/lastZeno", m);
  });

  it("deletes previous telegram alert", async () => {
    await run();

    expect(deleteMessage).toBeCalledWith({
      chat_id: 123,
      message_id: 456,
    });
  });

  it("recovers from failed delete", async () => {
    vi.mocked(deleteMessage).mockRejectedValueOnce(new Error("foo"));

    await run();

    expect(setDoc).toBeCalled();
  });

  it("recovers from failing to get last message", async () => {
    vi.mocked(getDoc).mockRejectedValueOnce(new Error("foo"));

    await run();

    expect(setDoc).toBeCalled();
  });
});
