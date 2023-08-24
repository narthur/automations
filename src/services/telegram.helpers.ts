import { sendMessage } from "./telegram";

export async function sendMessages(chat_id: string, messages: string[]) {
  for (const text of messages) {
    await sendMessage({
      chat_id,
      text,
    });
  }
}
