import env from "src/lib/env";
import { describe, expect, it, vi } from "vitest";

import getAuths from "./getAuths";

describe("getAuths", () => {
  it("handles no auths", () => {
    vi.mocked(env).mockResolvedValue("");

    const result = getAuths();

    expect(result).toEqual({});
  });
});
