import { TelegramUpdate } from "src/services/telegram/types/TelegramUpdate.js";
import { telegramAllowedUser, telegramWebhookToken } from "../secrets.js";
import getSlashCommandResponse from "./getSlashCommandResponse.js";
import { tryWithRelay } from "../services/telegram/tryWithRelay.js";
import { sendMessages } from "src/services/telegram/sendMessages.js";
import express from "express";
import { createDatapoint } from "src/services/beeminder.js";
import getGptResponse from "src/services/openai/getGptResponse.js";

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
    await createDatapoint("narthur", "mia", {
      value: text.length,
    });
    const texts =
      (await getSlashCommandResponse(text)) || (await getGptResponse(text));
    await sendMessages(chat.id, texts);
  });

  res.status(200).send("OK");
}
