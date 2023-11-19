import { describe, it } from "vitest";

import chat from "./chat.js";

describe("chat", () => {
  it("can parse", () => {
    chat.safeParse({});
  });
});
