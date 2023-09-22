import { TELEGRAM_CHAT_ID } from "../secrets.js";
import { tryWithRelay } from "../services/telegram/tryWithRelay.js";
import { sendMessages } from "src/services/telegram/sendMessages.js";
import { getPendingTasks } from "../services/taskratchet.js";
import { getResponse } from "../services/openai/index.js";
import defineSecret from "./defineSecret.js";

const morningPrompt = defineSecret("MORNING_PROMPT");

export default async function morning() {
  await tryWithRelay(TELEGRAM_CHAT_ID.value(), async () => {
    const tasks = await getPendingTasks();
    const formatted = tasks.map(
      (t) => `${t.task} due ${t.due} or pay $${t.cents / 100}`
    );
    const response = await getResponse([
      {
        content: morningPrompt.value(),
        role: "system",
      },
    ]);
    await sendMessages(TELEGRAM_CHAT_ID.value(), [
      response.content || "Failed to generate response.",
      `Here are your tasks for today:`,
      ...formatted,
    ]);
  });
}
