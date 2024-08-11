import type { APIContext } from "astro";
import env from "src/lib/env.js";
import getGptResponse from "src/services/openai/getGptResponse.js";
import { messageUpdate } from "src/services/telegram/schemas/update";
import { sendMessages } from "src/services/telegram/sendMessages.js";

import { tryWithRelay } from "../services/telegram/tryWithRelay.js";
import runCommand from "./runCommand.js";
import splitMessages from "./splitMessages.js";

async function getResponse(text: string): Promise<Promise<string[]>> {
  const commandResponse = await runCommand(text);

  if (commandResponse) {
    return commandResponse;
  }

  const gptResponse = await getGptResponse(text);

  return splitMessages(gptResponse);
}

export default async function handleBotRequest({ request: req }: APIContext) {
  const isTelegram =
    req.headers.get("x-telegram-bot-api-secret-token") ===
    env("TELEGRAM_WEBHOOK_TOKEN");

  if (!isTelegram) {
    console.error("Unauthorized request to Telegram webhook", {
      headers: req.headers,
    });
    return new Response("Forbidden", { status: 403 });
  }

  const json: unknown = await req.json();
  const result = messageUpdate.safeParse(json);

  if (!result.success) {
    console.error("Invalid request to Telegram webhook", {
      error: result.error,
    });
    return new Response("Bad Request", { status: 400 });
  }

  const message =
    result.success && "message" in result.data
      ? result.data.message
      : undefined;

  if (!message?.text) {
    console.warn("No text in message", { message });
    return new Response("OK");
  }

  const { text, from, chat } = message;

  const isAllowedUser = String(from?.id) === env("TELEGRAM_ALLOWED_USER");

  if (!isAllowedUser) {
    console.error("Unauthorized request to Telegram webhook", {
      from,
      chat,
    });
    return new Response("Forbidden", { status: 403 });
  }

  await tryWithRelay(chat.id, async () => {
    const texts = await getResponse(text);
    await sendMessages(chat.id, texts);
  });

  return new Response("OK");
}
