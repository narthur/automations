import { telegramChatId } from "../secrets.js";
import { sendMessages, tryWithRelay } from "../services/telegram.helpers.js";
import { getPendingTasks } from "../services/taskratchet.js";
import { getResponse } from "../services/openai.js";
import defineSecret from "./defineSecret.js";

const morningPrompt = defineSecret("MORNING_PROMPT");

export default async function morning() {
  await tryWithRelay(telegramChatId.value(), async () => {
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
    await sendMessages(telegramChatId.value(), [
      response.content || "Failed to generate response.",
      `Here are your tasks for today:`,
      ...formatted,
    ]);
  });
}
