import * as functions from "firebase-functions";
import {
  bmAuths,
  telegramApiToken,
  telegramChatId,
  telegramWebhookToken,
} from "../secrets";
import { getGoals } from "../services/beeminder";
import isNotificationDue from "../transforms/isNotificationDue";
import { sendMessage } from "../services/telegram";

export const zeno_cron = functions
  .runWith({
    secrets: [
      bmAuths.name,
      telegramApiToken.name,
      telegramWebhookToken.name,
      telegramChatId.name,
    ],
  })
  .pubsub.schedule("every 1 minutes")
  .onRun(async () => {
    const now = Date.now() / 1000;
    const goals = await getGoals();
    const sorted = goals.sort((a, b) => b.losedate - a.losedate);
    const next = sorted.find((g) => g.losedate > now && g.safebuf === 0);
    const shouldNotify =
      next &&
      isNotificationDue({
        due: next.losedate,
        now,
        window: 60,
      });

    if (!shouldNotify) return;

    await sendMessage({
      chat_id: telegramChatId.value(),
      text: `🚨 ${next.slug}: ${next.limsum}`,
    });
  });
