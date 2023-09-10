import {} from "node:test";
import { sendMessage } from "../services/telegram/index.js";
import morning from "./morning.js";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { getPendingTasks } from "../services/taskratchet.js";
import { getResponse } from "../services/openai.js";

function run() {
  return (morning as any)();
}

describe("morning", () => {
  beforeEach(() => {
    vi.mocked(getPendingTasks).mockResolvedValue([
      {
        task: "foo",
        due: "bar",
        cents: 100,
      } as any,
    ]);

    vi.mocked(getResponse).mockResolvedValue({
      content: "foo",
    } as any);
  });

  it("sends telegram messages", async () => {
    await run();

    expect(sendMessage).toBeCalledWith(
      expect.objectContaining({
        text: expect.stringContaining("Here are your tasks for today:"),
      })
    );
  });

  it("sends pending tasks", async () => {
    await run();

    expect(sendMessage).toBeCalledWith(
      expect.objectContaining({
        text: expect.stringContaining("foo due bar or pay $1"),
      })
    );
  });

  it("uses morning prompt", async () => {
    await run();

    expect(getResponse).toBeCalledWith([
      {
        content: "__SECRET_MORNING_PROMPT__",
        role: "system",
      },
    ]);
  });

  it("relays errors", async () => {
    vi.mocked(getPendingTasks).mockRejectedValue(new Error("foo"));
    await run();
    expect(sendMessage).toBeCalledWith(
      expect.objectContaining({
        text: expect.stringContaining("foo"),
      })
    );
  });
});
