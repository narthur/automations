import { telegramChatId } from "../secrets.js";
import { getGoals } from "../services/beeminder.js";
import isNotificationDue from "../transforms/isNotificationDue.js";
import { deleteMessage, sendMessage } from "../services/telegram.js";
import { TelegramMessage } from "src/services/telegram.types.js";

let last: TelegramMessage | null = null;

export default async function zeno() {
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

  if (last) {
    await deleteMessage({
      chat_id: last.chat.id,
      message_id: last.message_id,
    }).catch((e) => {
      console.error("Failed to delete previous message", e);
    });
  }

  last = m;
}
