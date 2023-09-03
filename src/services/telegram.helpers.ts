import telegramifyMarkdown from "telegramify-markdown";
import splitMessages from "../transforms/splitMessages.js";
import { sendMessage } from "./telegram.js";

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

export async function tryWithRelay(
  chat_id: number | string,
  fn: () => Promise<void>
): Promise<boolean> {
  try {
    await fn();
    return true;
  } catch (e) {
    let s = e instanceof Error ? e.toString() : "";
    s += `\n${JSON.stringify(e, null, 2)}`;
    await sendMessages(chat_id, [s]);
    return false;
  }
}
