import { sendMessages } from "./sendMessages.js";

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
