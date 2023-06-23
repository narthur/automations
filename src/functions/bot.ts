import * as functions from "firebase-functions";
import {
  bmAuths,
  openAiSecretKey,
  telegramApiToken,
  telegramWebhookToken,
} from "../secrets";
import getFunctionUrl from "../helpers/getFunctionUrl";
import { setWebhook, sendMessage } from "../services/telegram";
import { TelegramUpdate } from "../services/telegram.types";

export const bot_https = functions
  .runWith({
    secrets: [
      openAiSecretKey.name,
      bmAuths.name,
      telegramApiToken.name,
      telegramWebhookToken.name,
    ],
  })
  .https.onRequest(async (req, res) => {
    const token = req.headers["x-telegram-bot-api-secret-token"];

    if (token !== telegramWebhookToken.value()) {
      res.status(403).send("Forbidden");
      return;
    }

    const update = req.body as TelegramUpdate;
    const message = "message" in update ? update.message : undefined;

    if (!message) {
      res.status(200).send("OK");
      return;
    }

    await sendMessage({
      chat_id: message.chat.id,
      text: `Your user ID is ${String(message.from?.id)}`,
    });

    res.status(200).send("OK");
  });

export const bot_setup = functions
  .runWith({
    secrets: [telegramApiToken.name, telegramWebhookToken.name],
  })
  .https.onRequest(async (req, res) => {
    await setWebhook({
      url: getFunctionUrl(req, "bot_https"),
      secret_token: telegramWebhookToken.value(),
    });
  });
