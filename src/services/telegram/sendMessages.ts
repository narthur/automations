import telegramifyMarkdown from "telegramify-markdown";
import splitMessages from "../../transforms/splitMessages.js";
import { sendMessage } from "./index.js";

export async function sendMessages(
  chat_id: number | string,
  messages: string[]
) {
  const texts = messages.flatMap(splitMessages);
  for (const t of texts) {
    await sendMessage({
      chat_id,
      text: telegramifyMarkdown(t),
      parse_mode: "MarkdownV2",
    });
  }
}
