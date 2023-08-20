import { TelegramUpdate } from "../services/telegram.types";
import getGptResponse from "./getGptResponse";
import telegramifyMarkdown from "telegramify-markdown";
import * as functions from "firebase-functions";
import { telegramAllowedUser, telegramWebhookToken } from "../secrets";
import { sendMessage } from "../services/telegram";
import splitMessages from "../transforms/splitMessages";

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

  const texts = await getGptResponse(message.text).catch((e: unknown) => {
    let s = e instanceof Error ? e.toString() : "";
    s += `\n${JSON.stringify(e, null, 2)}`;
    return splitMessages(s);
  });

  console.log("chat id", message.chat.id);

  for (const t of texts) {
    await sendMessage({
      chat_id: message.chat.id,
      text: telegramifyMarkdown(t),
      parse_mode: "MarkdownV2",
    });
  }

  res.status(200).send("OK");
}
