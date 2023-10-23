import {} from "node:test";
import { sendMessage } from "../services/telegram/index.js";
import morning from "./morning.js";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { getDueTasks } from "../services/taskratchet.js";
import { getResponse } from "../services/openai/index.js";

function run() {
  return (morning as any)();
}

describe("morning", () => {
  beforeEach(() => {
    vi.mocked(getDueTasks).mockResolvedValue([
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
    vi.mocked(getDueTasks).mockRejectedValue(new Error("foo"));
    await run();
    expect(sendMessage).toBeCalledWith(
      expect.objectContaining({
        text: expect.stringContaining("foo"),
      })
    );
  });

  it("sends count of tasks due today", async () => {
    vi.mocked(getDueTasks).mockResolvedValue([
      {
        task: "foo",
        due: "bar",
        cents: 100,
      } as any,
      {
        task: "foo",
        due: "bar",
        cents: 100,
      } as any,
    ]);

    await run();

    expect(sendMessage).toBeCalledWith(
      expect.objectContaining({
        text: expect.stringContaining("2 tasks due today"),
      })
    );
  });

  it("does not send count of tasks due today if there are none", async () => {
    vi.mocked(getDueTasks).mockResolvedValue([]);

    await run();

    expect(sendMessage).not.toBeCalledWith(
      expect.objectContaining({
        text: expect.stringContaining("tasks due today"),
      })
    );
  });
});
