import z from "zod";

import message from "./message.js";

const base = z.object({
  update_id: z.number(),
});

export const messageUpdate = z
  .object({
    message: message,
  })
  .merge(base);

export const editedMessageUpdate = z
  .object({
    edited_message: message,
  })
  .merge(base);

export const channelPostUpdate = z
  .object({
    channel_post: message,
  })
  .merge(base);

export const editedChannelPostUpdate = z
  .object({
    edited_channel_post: message,
  })
  .merge(base);

export const inlineQueryUpdate = z
  .object({
    inline_query: z.unknown(),
  })
  .merge(base);

export const chosenInlineResultUpdate = z
  .object({
    chosen_inline_result: z.unknown(),
  })
  .merge(base);

export const callbackQueryUpdate = z
  .object({
    callback_query: z.unknown(),
  })
  .merge(base);

export const shippingQueryUpdate = z
  .object({
    shipping_query: z.unknown(),
  })
  .merge(base);

export const preCheckoutQueryUpdate = z
  .object({
    pre_checkout_query: z.unknown(),
  })
  .merge(base);

export const pollUpdate = z
  .object({
    poll: z.unknown(),
  })
  .merge(base);

export const pollAnswerUpdate = z
  .object({
    poll_answer: z.unknown(),
  })
  .merge(base);

export const myChatMemberUpdate = z
  .object({
    my_chat_member: z.unknown(),
  })
  .merge(base);

export const chatMemberUpdate = z
  .object({
    chat_member: z.unknown(),
  })
  .merge(base);

export const chatJoinRequestUpdate = z
  .object({
    chat_join_request: z.unknown(),
  })
  .merge(base);

const schema = z.union([
  messageUpdate,
  editedMessageUpdate,
  channelPostUpdate,
  editedChannelPostUpdate,
  inlineQueryUpdate,
  chosenInlineResultUpdate,
  callbackQueryUpdate,
  shippingQueryUpdate,
  preCheckoutQueryUpdate,
  pollUpdate,
  pollAnswerUpdate,
  myChatMemberUpdate,
  chatMemberUpdate,
  chatJoinRequestUpdate,
]);

export type TelegramUpdate = z.infer<typeof schema>;

export default schema;
