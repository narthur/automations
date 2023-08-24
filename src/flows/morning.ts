import * as functions from "firebase-functions";
import {
  taskratchetApiToken,
  taskratchetUserId,
  telegramApiToken,
  telegramChatId,
  telegramWebhookToken,
} from "../secrets";
import { sendMessages } from "../services/telegram.helpers";
import { getPendingTasks } from "../services/taskratchet";
import { defineSecret } from "firebase-functions/params";
import { getResponse } from "../services/openai";

const morningPrompt = defineSecret("MORNING_PROMPT");

export const morning_cron = functions
  .runWith({
    secrets: [
      telegramApiToken.name,
      telegramWebhookToken.name,
      telegramChatId.name,
      taskratchetUserId.name,
      taskratchetApiToken.name,
      morningPrompt.name,
    ],
  })
  .pubsub.schedule("every day 06:00")
  .onRun(async () => {
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
      `Good morning!`,
      `Here are your tasks for today:`,
      ...formatted,
      response.content || "Failed to generate response.",
    ]);
  });
