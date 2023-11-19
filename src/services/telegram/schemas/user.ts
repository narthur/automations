// export type TelegramUser = {
//     id: number;
//     is_bot: boolean;
//     first_name: string;
//     last_name?: string;
//     username?: string;
//     language_code?: string;
//     is_premium?: boolean;
//     added_to_attachment_menu?: boolean;
//     can_join_groups?: boolean;
//     can_read_all_group_messages?: boolean;
//     supports_inline_queries?: boolean;
//   };

import { z } from "zod";

const schema = z.object({
  id: z.number(),
  is_bot: z.boolean(),
  first_name: z.string(),
  last_name: z.string().optional(),
  username: z.string().optional(),
  language_code: z.string().optional(),
  is_premium: z.boolean().optional(),
  added_to_attachment_menu: z.boolean().optional(),
  can_join_groups: z.boolean().optional(),
  can_read_all_group_messages: z.boolean().optional(),
  supports_inline_queries: z.boolean().optional(),
});

export type TelegramUser = z.infer<typeof schema>;

export default schema;
