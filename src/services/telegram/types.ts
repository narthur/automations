export type TelegramResponse<T> =
  | {
      ok: true;
      result: T;
    }
  | {
      ok: false;
      description: string;
      error_code: number;
    };

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

export type TelegramMessage = {
  message_id: number;
  message_thread_id?: number;
  from?: TelegramUser;
  sender_chat?: TelegramChat;
  date: number;
  chat: TelegramChat;
  forward_from?: TelegramUser;
  forward_from_chat?: TelegramChat;
  forward_from_message_id?: number;
  forward_signature?: string;
  forward_sender_name?: string;
  forward_date?: number;
  is_topic_message?: boolean;
  is_automatic_forward?: boolean;
  reply_to_message?: unknown;
  via_bot?: TelegramUser;
  edit_date?: number;
  has_protected_content?: boolean;
  media_group_id?: string;
  author_signature?: string;
  text?: string;
  entities?: unknown[];
  animation?: unknown;
  audio?: unknown;
  document?: unknown;
  photo?: unknown[];
  sticker?: unknown;
  video?: unknown;
  video_note?: unknown;
  voice?: unknown;
  caption?: string;
  caption_entities?: unknown[];
  has_media_spoiler?: boolean;
  contact?: unknown;
  dice?: unknown;
  game?: unknown;
  poll?: unknown;
  venue?: unknown;
  location?: unknown;
  new_chat_members?: TelegramUser[];
  left_chat_member?: TelegramUser;
  new_chat_title?: string;
  new_chat_photo?: unknown[];
  delete_chat_photo?: boolean;
  group_chat_created?: boolean;
  supergroup_chat_created?: boolean;
  channel_chat_created?: boolean;
  message_auto_delete_timer_changed?: unknown;
  migrate_to_chat_id?: number;
  migrate_from_chat_id?: number;
  pinned_message?: unknown;
  invoice?: unknown;
  successful_payment?: unknown;
  user_shared?: unknown;
  chat_shared?: unknown;
  connected_website?: string;
  write_access_allowed?: unknown;
  passport_data?: unknown;
  proximity_alert_triggered?: unknown;
  forum_topic_created?: unknown;
  forum_topic_edited?: unknown;
  forum_topic_closed?: unknown;
  forum_topic_reopened?: unknown;
  general_forum_topic_hidden?: unknown;
  general_forum_topic_unhidden?: unknown;
  video_chat_scheduled?: unknown;
  video_chat_started?: unknown;
  video_chat_ended?: unknown;
  video_chat_participants_invited?: unknown;
  web_app_data?: unknown;
  reply_markup?: unknown;
};

export type TelegramUser = {
  id: number;
  is_bot: boolean;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  added_to_attachment_menu?: boolean;
  can_join_groups?: boolean;
  can_read_all_group_messages?: boolean;
  supports_inline_queries?: boolean;
};

export type TelegramChat = {
  id: number;
  type: string;
  title?: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  is_forum?: boolean;
  photo?: unknown;
  active_usernames?: string[];
  emoji_status_custom_emoji_id?: string;
  bio?: string;
  has_private_forwards?: boolean;
  has_restricted_voice_and_video_messages?: boolean;
  join_to_send_messages?: boolean;
  join_by_request?: boolean;
  description?: string;
  invite_link?: string;
  pinned_message?: TelegramMessage;
  permissions?: unknown;
  slow_mode_delay?: number;
  message_auto_delete_time?: number;
  has_aggressive_anti_spam_enabled?: boolean;
  has_hidden_members?: boolean;
  has_protected_content?: boolean;
  sticker_set_name?: string;
  can_set_sticker_set?: boolean;
  linked_chat_id?: number;
  location?: unknown;
};
