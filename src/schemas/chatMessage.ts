import { CreateChatCompletionRequestMessage } from "openai/resources/chat/index.js";
import { z } from "zod";

const chatMessage: z.ZodType<CreateChatCompletionRequestMessage> = z.object({
  role: z.enum(["user", "system", "function", "assistant"]),
  content: z.nullable(z.string()),
  name: z.optional(z.string()),
  function_call: z.optional(
    z.object({
      name: z.string(),
      arguments: z.string(),
    })
  ),
});

export default chatMessage;
