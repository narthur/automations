import { describe, expect, it, vi } from "vitest";
import getGptResponse from "./getGptResponse";
import { getResponse } from "../services/openai";
import { ChatCompletionResponseMessageRoleEnum } from "openai";
import { getGoals } from "../services/beeminder";
import { MAX_SMS_LENGTH } from "./splitMessages";

vi.mock("src/services/beeminder");

describe("getSmsResponse", () => {
  it("should return a response", async () => {
    vi.mocked(getResponse).mockResolvedValue({
      role: ChatCompletionResponseMessageRoleEnum.Assistant,
      content: "Hello world!",
    });
    const response = await getGptResponse("");
    expect(response).toContain("Hello world!");
  });

  it("passes prompt to openai", async () => {
    const prompt = "Hello world!";
    await getGptResponse(prompt);
    expect(getResponse).toHaveBeenCalledWith(prompt, expect.anything());
  });

  it("splits long messages", async () => {
    vi.mocked(getResponse).mockResolvedValue({
      role: ChatCompletionResponseMessageRoleEnum.Assistant,
      content: "a".repeat(MAX_SMS_LENGTH + 1),
    });
    const response = await getGptResponse("");
    expect(response).toHaveLength(2);
  });

  it("handlews newlines", async () => {
    vi.mocked(getResponse).mockResolvedValue({
      role: ChatCompletionResponseMessageRoleEnum.Assistant,
      content: "a\nb",
    });

    const response = await getGptResponse("");

    expect(response).toHaveLength(1);
  });

  it("numbers messages", async () => {
    vi.mocked(getResponse).mockResolvedValue({
      role: ChatCompletionResponseMessageRoleEnum.Assistant,
      content: "a".repeat(MAX_SMS_LENGTH + 1),
    });

    const response = await getGptResponse("");

    expect(response[0]).toContain("1/2");
  });

  it("calls functions", async () => {
    vi.mocked(getGoals).mockResolvedValue([]);
    vi.mocked(getResponse).mockResolvedValue({
      role: ChatCompletionResponseMessageRoleEnum.Assistant,
      function_call: {
        name: "getBeemergencies",
      },
    });
    await getGptResponse("");
    expect(getGoals).toBeCalled();
  });
});
