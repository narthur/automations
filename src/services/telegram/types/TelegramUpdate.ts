import { type TelegramMessage } from "./TelegramMessage.js";

export type TelegramUpdate = {
  update_id: number;
} & (
  | {
      message: TelegramMessage;
    }
  | {
      edited_message: TelegramMessage;
    }
  | {
      channel_post: TelegramMessage;
    }
  | {
      edited_channel_post: TelegramMessage;
    }
  | {
      inline_query: unknown;
    }
  | {
      chosen_inline_result: unknown;
    }
  | {
      callback_query: unknown;
    }
  | {
      shipping_query: unknown;
    }
  | {
      pre_checkout_query: unknown;
    }
  | {
      poll: unknown;
    }
  | {
      poll_answer: unknown;
    }
  | {
      my_chat_member: unknown;
    }
  | {
      chat_member: unknown;
    }
  | {
      chat_join_request: unknown;
    }
);
