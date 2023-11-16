import type { APIContext } from "astro";
import env from "src/lib/env.js";
import createDatapoint from "src/services/beeminder/createDatapoint.js";
import getGptResponse from "src/services/openai/getGptResponse.js";
import { sendMessages } from "src/services/telegram/sendMessages.js";
import { type TelegramUpdate } from "src/services/telegram/types/TelegramUpdate.js";

import { tryWithRelay } from "../services/telegram/tryWithRelay.js";
import runCommand from "./runCommand.js";

export default async function handleBotRequest({ request: req }: APIContext) {
  const isTelegram =
    req.headers.get("x-telegram-bot-api-secret-token") ===
    env("TELEGRAM_WEBHOOK_TOKEN");

  if (!isTelegram) {
    return new Response("Forbidden", { status: 403 });
  }

  // TODO: Use zod to validate this
  const update = req.body as unknown as TelegramUpdate;
  const message = "message" in update ? update.message : undefined;

  if (!message?.text) {
    return new Response("OK");
  }

  const { text, from, chat } = message;

  const isAllowedUser = String(from?.id) === env("TELEGRAM_ALLOWED_USER");

  if (!isAllowedUser) {
    return new Response("Forbidden", { status: 403 });
  }

  await tryWithRelay(chat.id, async () => {
    await createDatapoint("narthur", "mia", {
      value: text.length,
    });
    const texts = (await runCommand(text)) || (await getGptResponse(text));
    await sendMessages(chat.id, texts);
  });

  return new Response("OK");
}
