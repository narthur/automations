import { z } from "zod";

import message, { type TelegramMessage } from "./message";

// WORKAROUND: https://github.com/colinhacks/zod#recursive-types
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

const schema: z.ZodType<TelegramChat> = z.object({
  id: z.number(),
  type: z.string(),
  title: z.string().optional(),
  username: z.string().optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  is_forum: z.boolean().optional(),
  photo: z.unknown().optional(),
  active_usernames: z.array(z.string()).optional(),
  emoji_status_custom_emoji_id: z.string().optional(),
  bio: z.string().optional(),
  has_private_forwards: z.boolean().optional(),
  has_restricted_voice_and_video_messages: z.boolean().optional(),
  join_to_send_messages: z.boolean().optional(),
  join_by_request: z.boolean().optional(),
  description: z.string().optional(),
  invite_link: z.string().optional(),
  pinned_message: z.optional(message),
  permissions: z.unknown().optional(),
  slow_mode_delay: z.number().optional(),
  message_auto_delete_time: z.number().optional(),
  has_aggressive_anti_spam_enabled: z.boolean().optional(),
  has_hidden_members: z.boolean().optional(),
  has_protected_content: z.boolean().optional(),
  sticker_set_name: z.string().optional(),
  can_set_sticker_set: z.boolean().optional(),
  linked_chat_id: z.number().optional(),
  location: z.unknown().optional(),
});

export default schema;
