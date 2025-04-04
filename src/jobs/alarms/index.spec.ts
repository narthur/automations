import env from "src/lib/env";
import isNotificationDue from "src/lib/isNotificationDue";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { createAlarmTrigger } from ".";

vi.mock("src/lib/isNotificationDue");

describe("createAlarmTrigger", () => {
  beforeEach(() => {
    vi.mocked(env).mockReturnValue("123");
    vi.setSystemTime(1);
  });

  it("ignores timestamps in the past", async () => {
    const trigger = createAlarmTrigger({
      id: "test",
      getItems: () =>
        Promise.resolve([
          { name: "past", timestamp: 0 },
          { name: "future", timestamp: 10 },
        ]),
    });

    await trigger();

    expect(isNotificationDue).not.toBeCalledWith(
      expect.objectContaining({
        due: 0,
      })
    );
  });
});
