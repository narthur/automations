import * as functions from "firebase-functions";
import {
  bmAuths,
  openAiSecretKey,
  telegramAllowedUser,
  telegramApiToken,
  telegramWebhookToken,
} from "../secrets";
import getFunctionUrl from "../helpers/getFunctionUrl";
import { setWebhook, sendMessage } from "../services/telegram";
import { TelegramUpdate } from "../services/telegram.types";
import getGptResponse from "../helpers/getGptResponse";

export const bot_https = functions
  .runWith({
    secrets: [
      openAiSecretKey.name,
      bmAuths.name,
      telegramApiToken.name,
      telegramWebhookToken.name,
      telegramAllowedUser.name,
    ],
  })
  .https.onRequest(async (req, res) => {
    const isTelegram =
      req.headers["x-telegram-bot-api-secret-token"] ===
      telegramWebhookToken.value();

    if (!isTelegram) {
      res.status(403).send("Forbidden");
      return;
    }

    const update = req.body as TelegramUpdate;
    const message = "message" in update ? update.message : undefined;

    if (!message) {
      res.status(200).send("OK");
      return;
    }

    const isAllowedUser =
      String(message.from?.id) === telegramAllowedUser.value();

    if (!isAllowedUser) {
      res.status(403).send("Forbidden");
      return;
    }

    if (!message.text) {
      res.status(200).send("OK");
      return;
    }

    const texts = await getGptResponse(message.text);

    for (const text of texts) {
      await sendMessage({
        chat_id: message.chat.id,
        text,
      });
    }

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
    res.status(200).send("OK");
  });
