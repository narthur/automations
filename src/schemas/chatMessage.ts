import type {
  ChatCompletionAssistantMessageParam,
  ChatCompletionFunctionMessageParam,
  ChatCompletionMessageParam,
  ChatCompletionSystemMessageParam,
  ChatCompletionToolMessageParam,
  ChatCompletionUserMessageParam,
} from "openai/resources/chat/index.js";
import { z } from "zod";

const systemMessage: z.ZodType<ChatCompletionSystemMessageParam> = z.object({
  role: z.literal("system"),
  content: z.string(),
  name: z.optional(z.string()),
});

const userMessage: z.ZodType<ChatCompletionUserMessageParam> = z.object({
  role: z.literal("user"),
  content: z.string(),
  name: z.optional(z.string()),
});

const assistantMessage: z.ZodType<ChatCompletionAssistantMessageParam> =
  z.object({
    role: z.literal("assistant"),
    content: z.string(),
    name: z.optional(z.string()),
  });

const toolMessage: z.ZodType<ChatCompletionToolMessageParam> = z.object({
  role: z.literal("tool"),
  content: z.string(),
  tool_call_id: z.string(),
});

const functionMessage: z.ZodType<ChatCompletionFunctionMessageParam> = z.object(
  {
    role: z.literal("function"),
    content: z.nullable(z.string()),
    name: z.string(),
  }
);

const chatMessage: z.ZodType<ChatCompletionMessageParam> = systemMessage
  .or(userMessage)
  .or(assistantMessage)
  .or(toolMessage)
  .or(functionMessage);

export default chatMessage;
