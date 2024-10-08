import axios, { type AxiosRequestConfig } from "axios";

import env from "../../lib/env.js";
import type { TelegramMessage } from "./schemas/message.js";
import { type ForceReply } from "./types/ForceReply.js";
import { type InlineKeyboardMarkup } from "./types/InlineKeyboardMarkup.js";
import { type ReplyKeyboardMarkup } from "./types/ReplyKeyboardMarkup.js";
import { type ReplyKeyboardRemove } from "./types/ReplyKeyboardRemove.js";
import { type TelegramResponse } from "./types/TelegramResponse.js";

// https://core.telegram.org/bots/api#setwebhook
export function setWebhook(data: {
  url: string;
  certificate?: unknown;
  ip_address?: string;
  max_connections?: number;
  allowed_updates?: string[];
  drop_pending_updates?: boolean;
  secret_token?: string;
}) {
  return api("setWebhook", {
    method: "POST",
    data,
  });
}

// https://core.telegram.org/bots/api#sendmessage
export function sendMessage(data: {
  chat_id: number | string;
  message_thread_id?: number;
  text: string;
  parse_mode?: "MarkdownV2" | "HTML";
  entities?: unknown[];
  disable_web_page_preview?: boolean;
  disable_notification?: boolean;
  protect_content?: boolean;
  reply_to_message_id?: number;
  allow_sending_without_reply?: boolean;
  reply_markup?:
    | InlineKeyboardMarkup
    | ReplyKeyboardMarkup
    | ReplyKeyboardRemove
    | ForceReply;
}) {
  return api<TelegramMessage>("sendMessage", {
    method: "POST",
    data,
  });
}

// https://core.telegram.org/bots/api#deletemessage
export function deleteMessage(data: {
  chat_id: number | string;
  message_id: number;
}) {
  return api("deleteMessage", {
    method: "POST",
    data,
  });
}

async function api<T>(p: string, o: AxiosRequestConfig = {}): Promise<T> {
  const t = env("TELEGRAM_API_TOKEN");
  const u = `https://api.telegram.org/bot${t}/${p}`;

  const r = await axios<TelegramResponse<T>>(u, {
    validateStatus: () => true, // Don't throw on non-2xx status codes
    ...o,
  }).catch((err) => {
    console.error("Error while calling Telegram API", {
      endpoint: p,
      url: u,
      options: o,
      token: t,
    });
    throw err;
  });

  if (!r.data.ok) {
    console.error("Telegram API returned error", {
      endpoint: p,
      url: u,
      options: o,
      token: t,
      response: r.data,
    });
    throw new Error(r.data.description);
  }

  return r.data.result;
}
