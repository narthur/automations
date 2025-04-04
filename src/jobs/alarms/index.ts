import env from "src/lib/env.js";
import isNotificationDue from "src/lib/isNotificationDue.js";
import { deleteMessage, sendMessage } from "src/services/telegram/index.js";
import { type TelegramMessage } from "src/services/telegram/schemas/message.js";

type Item = {
  name: string;
  timestamp: number;
};

type Options = {
  id: string;
  getItems: () => Promise<Item[]>;
};

export function createAlarmTrigger(options: Options) {
  let last: TelegramMessage | null = null;

  return async () => {
    const items = await options.getItems();
    const now = Date.now() / 1000;
    const sorted = items
      .filter((i) => i.timestamp >= now)
      .sort((a: Item, b: Item) => a.timestamp - b.timestamp);
    const next = sorted[0];

    if (!next) {
      console.info(`${options.id}: no next item`);
      return;
    }

    const nextDate = new Date(next.timestamp * 1000).toLocaleDateString();
    const today = new Date(Date.now()).toLocaleDateString();

    if (nextDate !== today) {
      console.info(`${options.id}: not due today: ${nextDate} !== ${today}`);
      return;
    }

    const isDueNow = isNotificationDue({
      due: next.timestamp,
      now: Date.now() / 1000,
      window: 60,
    });

    if (!isDueNow) {
      console.info(`${options.id}: not due now: ${next.timestamp}`);
      return;
    }

    console.info(`${options.id}: sending notification`);

    const due = new Date(next.timestamp * 1000).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
    });

    const chat_id = env("TELEGRAM_CHAT_ID");

    if (!chat_id) {
      throw new Error("TELEGRAM_CHAT_ID is not set");
    }

    const m = await sendMessage({
      chat_id,
      text: `🚨 Due by ${due}: ${next.name}`,
    });

    if (last) {
      await deleteMessage({
        chat_id: last.chat.id,
        message_id: last.message_id,
      }).catch((e) => {
        console.error(`${options.id}: Failed to delete previous message`, e);
      });
    }

    last = m;
  };
}
