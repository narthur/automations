import {
  ChatCompletionRequestMessage,
  ChatCompletionRequestMessageRoleEnum,
} from "openai";
import { z } from "zod";

export const zChatCompletionRequestMessage: z.ZodType<ChatCompletionRequestMessage> =
  z.object({
    role: z.nativeEnum(ChatCompletionRequestMessageRoleEnum),
    content: z.optional(z.string()),
    name: z.optional(z.string()),
    function_call: z.optional(
      z.object({
        name: z.string(),
        arguments: z.string(),
      })
    ),
  });
