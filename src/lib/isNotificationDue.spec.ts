import { describe, expect,it } from "vitest";

import isNotificationDue from "./isNotificationDue.js";

describe("isNotificationDue", () => {
  it("should return true if the notification is due", () => {
    expect(isNotificationDue({ due: 0, now: 0, window: 10 })).toBe(true);
  });

  it("uses zeno schedule", () => {
    // window 10 zeno schedule:
    // 0, 10, 20, 40, 80, ...
    expect(isNotificationDue({ due: 40, now: 0, window: 10 })).toBe(true);
  });

  it("returns false if the notification is not due", () => {
    expect(isNotificationDue({ due: 100, now: 0, window: 10 })).toBe(false);
  });
});
