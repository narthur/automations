import { TelegramUpdate } from "../services/telegram.types";
import getGptResponse from "./getGptResponse";
import * as functions from "firebase-functions";
import { telegramAllowedUser, telegramWebhookToken } from "../secrets";
import getSlashCommandResponse from "./getSlashCommandResponse";
import { sendMessages, tryWithRelay } from "../services/telegram.helpers";

export default async function handleBotRequest(
  req: functions.https.Request,
  res: functions.Response
) {
  const isTelegram =
    req.headers["x-telegram-bot-api-secret-token"] ===
    telegramWebhookToken.value();

  if (!isTelegram) {
    res.status(403).send("Forbidden");
    return;
  }

  const update = req.body as TelegramUpdate;
  const message = "message" in update ? update.message : undefined;

  if (!message?.text) {
    res.status(200).send("OK");
    return;
  }

  const { text, from, chat } = message;

  const isAllowedUser = String(from?.id) === telegramAllowedUser.value();

  if (!isAllowedUser) {
    res.status(403).send("Forbidden");
    return;
  }

  await tryWithRelay(chat.id, async () => {
    const texts =
      (await getSlashCommandResponse(text)) || (await getGptResponse(text));
    await sendMessages(chat.id, texts);
  });

  res.status(200).send("OK");
}
