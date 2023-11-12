import isNotificationDue from "src/lib/isNotificationDue.js";
import { TELEGRAM_CHAT_ID } from "src/secrets.js";
import { deleteMessage, sendMessage } from "src/services/telegram/index.js";
import { TelegramMessage } from "src/services/telegram/types/TelegramMessage.js";

type Item = {
  name: string;
  timestamp: number;
};

type Options = {
  getItems: () => Promise<Item[]>;
};

export function createAlarmTrigger(options: Options) {
  let last: TelegramMessage | null = null;

  return async () => {
    const items = await options.getItems();
    const sorted = items.sort((a: Item, b: Item) => a.timestamp - b.timestamp);
    const next = sorted[0];
    const nextDate = new Date(next.timestamp * 1000).toLocaleDateString(
      "en-US",
      {
        weekday: "long",
        month: "long",
        day: "numeric",
      }
    );
    const nowDate = new Date(Date.now()).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
    const isDueToday = nextDate === nowDate;

    const shouldNotify =
      next &&
      isDueToday &&
      isNotificationDue({
        due: next.timestamp,
        now: Date.now() / 1000,
        window: 60,
      });

    if (!shouldNotify) {
      console.log("no notification due");
      return;
    }

    const due = new Date(next.timestamp * 1000).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
    });

    const m = await sendMessage({
      chat_id: TELEGRAM_CHAT_ID.value(),
      text: `🚨 Due by ${due}: ${next.name}`,
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
  };
}
