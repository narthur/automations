import * as functions from "firebase-functions";
import {
  allNotion,
  bmAuths,
  openAiPrompt,
  openAiSecretKey,
  taskratchetApiToken,
  taskratchetUserId,
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
      openAiPrompt.name,
      bmAuths.name,
      telegramApiToken.name,
      telegramWebhookToken.name,
      telegramAllowedUser.name,
      taskratchetUserId.name,
      taskratchetApiToken.name,
      ...allNotion,
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
