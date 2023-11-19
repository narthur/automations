import { beforeEach } from "node:test";

import { describe, expect, it, vi } from "vitest";

import { runQuery } from "./index";

describe("services", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("should work", async () => {
    const result = await runQuery("query { hello }");

    expect(result.data?.hello).toBe("Hello, World!");
  });
});
