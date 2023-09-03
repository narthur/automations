import { TelegramUpdate } from "../services/telegram.types.js";
import getGptResponse from "./getGptResponse.js";
import { telegramAllowedUser, telegramWebhookToken } from "../secrets.js";
import getSlashCommandResponse from "./getSlashCommandResponse.js";
import { sendMessages, tryWithRelay } from "../services/telegram.helpers.js";
import express from "express";

export default async function handleBotRequest(
  req: express.Request,
  res: express.Response
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
