import axios, { AxiosRequestConfig } from "axios";
import { telegramApiToken } from "../secrets.js";
import { TelegramMessage, TelegramResponse } from "./telegram.types.js";

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
  reply_markup?: unknown;
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
  const t = telegramApiToken.value();
  const u = `https://api.telegram.org/bot${t}/${p}`;

  const r = await axios<TelegramResponse<T>>(u, o).catch((err) => {
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
