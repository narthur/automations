import { MORNING_PROMPT, TELEGRAM_CHAT_ID } from "../secrets.js";
import { tryWithRelay } from "../services/telegram/tryWithRelay.js";
import { sendMessages } from "src/services/telegram/sendMessages.js";
import { getResponse } from "../services/openai/index.js";
import { getDueTasks } from "src/services/taskratchet.js";

export default async function morning() {
  await tryWithRelay(TELEGRAM_CHAT_ID.value(), async () => {
    const tasks = await getDueTasks();
    const response = await getResponse([
      {
        content: MORNING_PROMPT.value(),
        role: "system",
      },
    ]);

    await sendMessages(TELEGRAM_CHAT_ID.value(), [
      response.content || "Failed to generate response.",
    ]);

    if (!tasks.length) return;

    await sendMessages(TELEGRAM_CHAT_ID.value(), [
      `[${tasks.length} tasks due today!](https://app.taskratchet.com/)`,
    ]);
  });
}
