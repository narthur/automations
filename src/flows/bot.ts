import * as functions from "firebase-functions";
import {
  bmAuths,
  openAiSecretKey,
  telegramAllowedUser,
  telegramApiToken,
  telegramWebhookToken,
} from "../secrets";
import getFunctionUrl from "../transforms/getFunctionUrl";
import { setWebhook } from "../services/telegram";

import handleBotRequest from "../effects/handleBotRequest";

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
  .https.onRequest(handleBotRequest);

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