import { describe, expect, it, vi } from "vitest";

import { MAX_MESSAGE_LENGTH } from "../../lib/splitMessages.js";
import getGoals from "../beeminder/getGoals.js";
import getGptResponse from "./getGptResponse.js";
import { getResponse } from "./index.js";

describe("getGptResponse", () => {
  it("should return a response", async () => {
    vi.mocked(getResponse).mockResolvedValue({
      role: "assistant",
      content: "Hello world!",
      refusal: null,
    });

    const response = await getGptResponse("");

    expect(response).toContain("Hello world!");
  });

  it("passes prompt to openai", async () => {
    const prompt = "Hello world!";

    await getGptResponse(prompt);

    expect(getResponse).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          content: prompt,
        }),
      ]),
      expect.anything()
    );
  });

  it("splits long messages", async () => {
    vi.mocked(getResponse).mockResolvedValue({
      role: "assistant",
      content: "a".repeat(MAX_MESSAGE_LENGTH + 1),
      refusal: null,
    });

    const response = await getGptResponse("");

    expect(response).toHaveLength(2);
  });

  it("handlews newlines", async () => {
    vi.mocked(getResponse).mockResolvedValue({
      role: "assistant",
      content: "a\nb",
      refusal: null,
    });

    const response = await getGptResponse("");

    expect(response).toHaveLength(1);
  });

  it("calls functions", async () => {
    vi.mocked(getGoals).mockResolvedValue([]);
    vi.mocked(getResponse).mockResolvedValue({
      role: "assistant",
      content: null,
      function_call: {
        name: "getBeemergencies",
        arguments: "{}",
      },
      refusal: null,
    });

    await getGptResponse("");

    expect(getGoals).toBeCalled();
  });
});
