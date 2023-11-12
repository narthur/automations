import isNotificationDue from "src/lib/isNotificationDue.js";
import { TELEGRAM_CHAT_ID } from "src/secrets.js";
import { getTasks } from "src/services/taskratchet.js";
import { deleteMessage, sendMessage } from "src/services/telegram/index.js";
import { TelegramMessage } from "src/services/telegram/types/TelegramMessage.js";

let last: TelegramMessage | null = null;

export async function send() {
  const now = Date.now() / 1000;
  const tasks = await getTasks();

  tasks.sort((a, b) => a.due_timestamp - b.due_timestamp);

  const next = tasks[0];

  const shouldNotify =
    next &&
    isNotificationDue({
      due: next.due_timestamp,
      now,
      window: 60,
    });

  if (!shouldNotify) {
    console.log("no notification due");
    return;
  }

  const due = new Date(next.due_timestamp * 1000).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
  });

  const m = await sendMessage({
    chat_id: TELEGRAM_CHAT_ID.value(),
    text: `🚨 Due by ${due}: ${next.task}`,
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

export default {
  send,
};
