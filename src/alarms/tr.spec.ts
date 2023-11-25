import { getPendingTasks } from "src/services/taskratchet/index.js";
import { deleteMessage, sendMessage } from "src/services/telegram/index.js";
import { type TelegramMessage } from "src/services/telegram/schemas/message.js";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { send } from "./tr.js";

describe("tr", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(0);
    vi.mocked(getPendingTasks).mockResolvedValue([
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

    expect(getPendingTasks).toBeCalled();
  });

  it("sends to correct chat", async () => {
    await send();

    expect(sendMessage).toBeCalledWith(
      expect.objectContaining({
        chat_id: "__TELEGRAM_CHAT_ID_VALUE__",
      })
    );
  });

  it("does not send notification if not due", async () => {
    vi.mocked(getPendingTasks).mockResolvedValue([
      {
        due_timestamp: 600,
      },
    ] as any);

    await send();

    expect(sendMessage).not.toBeCalled();
  });

  it("notifies for next due task", async () => {
    vi.mocked(getPendingTasks).mockResolvedValue([
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
    vi.mocked(getPendingTasks).mockResolvedValue([
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
    vi.mocked(getPendingTasks).mockResolvedValue([
      {
        due_timestamp: 60 * 2 ** 27,
      },
    ] as any);

    await send();

    expect(sendMessage).not.toBeCalled();
  });
});
