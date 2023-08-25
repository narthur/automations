import * as functions from "firebase-functions";
import {
  allOpenAi,
  allTaskratchet,
  allTelegram,
  telegramChatId,
} from "../secrets";
import { sendMessages, tryWithRelay } from "../services/telegram.helpers";
import { getPendingTasks } from "../services/taskratchet";
import { defineSecret } from "firebase-functions/params";
import { getResponse } from "../services/openai";

const morningPrompt = defineSecret("MORNING_PROMPT");

export const morning_cron = functions
  .runWith({
    secrets: [
      ...allOpenAi,
      ...allTelegram,
      ...allTaskratchet,
      morningPrompt.name,
    ],
  })
  .pubsub.schedule("every day 03:00")
  .onRun(async () => {
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
  });
