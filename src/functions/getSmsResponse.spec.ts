import { describe, expect, it, vi } from "vitest";
import getSmsResponse, { MAX_SMS_LENGTH } from "./getSmsResponse";
import { getResponse } from "src/services/openai";
import { ChatCompletionResponseMessageRoleEnum } from "openai";

describe("getSmsResponse", () => {
  it("should return a response", async () => {
    vi.mocked(getResponse).mockResolvedValue({
      role: ChatCompletionResponseMessageRoleEnum.Assistant,
      content: "Hello world!",
    });
    const response = await getSmsResponse("");
    expect(response).toContain("Hello world!");
  });

  it("passes prompt to openai", async () => {
    const prompt = "Hello world!";
    await getSmsResponse(prompt);
    expect(getResponse).toHaveBeenCalledWith(prompt);
  });

  it("splits long messages", async () => {
    vi.mocked(getResponse).mockResolvedValue({
      role: ChatCompletionResponseMessageRoleEnum.Assistant,
      content: "a".repeat(MAX_SMS_LENGTH + 1),
    });
    const response = await getSmsResponse("");
    expect(response).toHaveLength(2);
  });

  it("handlews newlines", async () => {
    vi.mocked(getResponse).mockResolvedValue({
      role: ChatCompletionResponseMessageRoleEnum.Assistant,
      content: "a\nb",
    });

    const response = await getSmsResponse("");

    expect(response).toHaveLength(2);
  });

  it("numbers messages", async () => {
    vi.mocked(getResponse).mockResolvedValue({
      role: ChatCompletionResponseMessageRoleEnum.Assistant,
      content: "a\nb",
    });

    const response = await getSmsResponse("");

    expect(response[0]).toContain("1/2");
  });
});
