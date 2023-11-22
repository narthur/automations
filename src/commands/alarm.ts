import cmd from "src/lib/cmd";
import env from "src/lib/env";
import { sendMessages } from "src/services/telegram/sendMessages.js";

export default cmd("alarm", (message) => {
  const [, seconds = 0] = message.match(/^\/alarm (\d+)$/) || [];

  new Promise((resolve) => setTimeout(resolve, Number(seconds) * 1000))
    .then(() => {
      const chatId = env("TELEGRAM_CHAT_ID");

      if (!chatId) {
        throw new Error("TELEGRAM_CHAT_ID is not set");
      }

      return sendMessages(chatId, ["🚨 Alarm!"]);
    })
    .catch((e) => {
      console.error(e);
    });

  return `Test alarm scheduled in ${seconds} seconds`;
});
