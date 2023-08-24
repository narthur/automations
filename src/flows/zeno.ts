import * as functions from "firebase-functions";
import {
  bmAuths,
  telegramApiToken,
  telegramChatId,
  telegramWebhookToken,
} from "../secrets";
import { getGoals } from "../services/beeminder";
import isNotificationDue from "../transforms/isNotificationDue";
import { deleteMessage, sendMessage } from "../services/telegram";
import { setDoc, getDoc } from "../services/firestore";
import z from "zod";

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
    const sorted = goals.sort((a, b) => a.losedate - b.losedate);
    const next = sorted.find((g) => g.losedate > now && g.safebuf === 0);

    console.log("next", next?.slug);

    const shouldNotify =
      next &&
      isNotificationDue({
        due: next.losedate,
        now,
        window: 60,
      });

    if (!shouldNotify) {
      console.log("no notification due");
      return;
    }

    const m = await sendMessage({
      chat_id: telegramChatId.value(),
      text: `🚨 ${next.slug}: ${next.limsum}`,
    });

    const schema = z.object({
      message_id: z.number(),
      chat: z.object({
        id: z.number(),
      }),
    });

    const last = await getDoc<Record<string, unknown>>("meta/lastZeno")
      .then((d) => schema.parse(d))
      .catch((e) => {
        console.error("Failed to get last zeno message", e);
        return null;
      });

    if (last) {
      await deleteMessage({
        chat_id: last.chat.id,
        message_id: last.message_id,
      }).catch((e) => {
        console.error("Failed to delete previous message", e);
      });
    }

    await setDoc("meta/lastZeno", m);
  });
