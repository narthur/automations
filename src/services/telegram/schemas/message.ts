import { z } from "zod";

import chat, { type TelegramChat } from "./chat.js";
import user, { type TelegramUser } from "./user.js";

// WORKAROUND: https://github.com/colinhacks/zod#recursive-types
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

const schema: z.ZodType<TelegramMessage> = z.object({
  message_id: z.number(),
  message_thread_id: z.number().optional(),
  from: user.optional(),
  sender_chat: z.lazy(() => chat.optional()),
  date: z.number(),
  chat: chat,
  forward_from: user.optional(),
  forward_from_chat: z.lazy(() => chat.optional()),
  forward_from_message_id: z.number().optional(),
  forward_signature: z.string().optional(),
  forward_sender_name: z.string().optional(),
  forward_date: z.number().optional(),
  is_topic_message: z.boolean().optional(),
  is_automatic_forward: z.boolean().optional(),
  reply_to_message: z.unknown().optional(),
  via_bot: user.optional(),
  edit_date: z.number().optional(),
  has_protected_content: z.boolean().optional(),
  media_group_id: z.string().optional(),
  author_signature: z.string().optional(),
  text: z.string().optional(),
  entities: z.array(z.unknown()).optional(),
  animation: z.unknown().optional(),
  audio: z.unknown().optional(),
  document: z.unknown().optional(),
  photo: z.array(z.unknown()).optional(),
  sticker: z.unknown().optional(),
  video: z.unknown().optional(),
  video_note: z.unknown().optional(),
  voice: z.unknown().optional(),
  caption: z.string().optional(),
  caption_entities: z.array(z.unknown()).optional(),
  has_media_spoiler: z.boolean().optional(),
  contact: z.unknown().optional(),
  dice: z.unknown().optional(),
  game: z.unknown().optional(),
  poll: z.unknown().optional(),
  venue: z.unknown().optional(),
  location: z.unknown().optional(),
  new_chat_members: z.array(user).optional(),
  left_chat_member: user.optional(),
  new_chat_title: z.string().optional(),
  new_chat_photo: z.array(z.unknown()).optional(),
  delete_chat_photo: z.boolean().optional(),
  group_chat_created: z.boolean().optional(),
  supergroup_chat_created: z.boolean().optional(),
  channel_chat_created: z.boolean().optional(),
  message_auto_delete_timer_changed: z.unknown().optional(),
  migrate_to_chat_id: z.number().optional(),
  migrate_from_chat_id: z.number().optional(),
  pinned_message: z.unknown().optional(),
  invoice: z.unknown().optional(),
  successful_payment: z.unknown().optional(),
  user_shared: z.unknown().optional(),
  chat_shared: z.unknown().optional(),
  connected_website: z.string().optional(),
  write_access_allowed: z.unknown().optional(),
  passport_data: z.unknown().optional(),
  proximity_alert_triggered: z.unknown().optional(),
  forum_topic_created: z.unknown().optional(),
  forum_topic_edited: z.unknown().optional(),
  forum_topic_closed: z.unknown().optional(),
  forum_topic_reopened: z.unknown().optional(),
  general_forum_topic_hidden: z.unknown().optional(),
  general_forum_topic_unhidden: z.unknown().optional(),
  video_chat_scheduled: z.unknown().optional(),
  video_chat_started: z.unknown().optional(),
  video_chat_ended: z.unknown().optional(),
  video_chat_participants_invited: z.unknown().optional(),
  web_app_data: z.unknown().optional(),
  reply_markup: z.unknown().optional(),
});

export default schema;
