import { getTasks } from "src/services/taskratchet.js";
import { deleteMessage, sendMessage } from "src/services/telegram/index.js";
import { TelegramMessage } from "src/services/telegram/types/TelegramMessage.js";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { send } from "./tr.js";

describe("tr", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(0);
    vi.mocked(getTasks).mockResolvedValue([
      {
        due_timestamp: 0,
      },
    ] as any);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("gets tasks", async () => {
    await send();

    expect(getTasks).toBeCalled();
  });

  it("sends to correct chat", async () => {
    await send();

    expect(sendMessage).toBeCalledWith(
      expect.objectContaining({
        chat_id: "__SECRET_TELEGRAM_CHAT_ID__",
      })
    );
  });

  it("does not send notification if not due", async () => {
    vi.mocked(getTasks).mockResolvedValue([
      {
        due_timestamp: 600,
      },
    ] as any);

    await send();

    expect(sendMessage).not.toBeCalled();
  });

  it("notifies for next due task", async () => {
    vi.mocked(getTasks).mockResolvedValue([
      {
        task: "later",
        due_timestamp: 1,
      },
      {
        task: "sooner",
        due_timestamp: 0,
      },
    ] as any);

    await send();

    expect(sendMessage).toBeCalledWith(
      expect.objectContaining({
        text: expect.stringContaining("sooner"),
      })
    );
  });

  it("includes due time", async () => {
    vi.mocked(getTasks).mockResolvedValue([
      {
        task: "sooner",
        due_timestamp: 0,
      },
    ] as any);

    await send();

    expect(sendMessage).toBeCalledWith(
      expect.objectContaining({
        text: expect.stringContaining("7:00 PM"),
      })
    );
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

  it("includes alarm token", async () => {
    await send();

    expect(sendMessage).toBeCalledWith(
      expect.objectContaining({
        text: expect.stringContaining("🚨"),
      })
    );
  });

  it("does not send notifications if not due today", async () => {
    vi.mocked(getTasks).mockResolvedValue([
      {
        due_timestamp: 60 * 2 ** 27,
      },
    ] as any);

    await send();

    expect(sendMessage).not.toBeCalled();
  });
});
