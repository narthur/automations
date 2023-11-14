import z from "zod";

// TODO: update schema to support all event types

const schema = z.object({
  event_id: z.number(),
  created_at: z.string(),
  creator_id: z.number(),
  metadata: z.object({
    action: z.union([z.literal("created"), z.literal("updated")]), // TODO: add more actions
    event_user_id: z.string(),
    model: z.literal("time_entry"), // TODO: add more models
    model_owner_id: z.string(),
    path: z.string(),
    project_id: z.string(),
    project_is_private: z.string(),
    request_body: z.string(),
    request_type: z.string(),
    time_entry_id: z.string(),
    workspace_id: z.string(),
  }),
  payload: z.object({
    at: z.string(),
    billable: z.boolean(),
    description: z.string(),
    duration: z.number(),
    duronly: z.boolean(),
    id: z.number(),
    pid: z.number(),
    project_id: z.number(),
    server_deleted_at: z.null(),
    start: z.string(),
    stop: z.string().nullable(),
    tag_ids: z.array(z.number()),
    tags: z.array(z.string()),
    task_id: z.null(),
    uid: z.number(),
    user_id: z.number(),
    wid: z.number(),
    workspace_id: z.number(),
  }),
  subscription_id: z.number(),
  timestamp: z.string(),
  url_callback: z.string(),
});

export type TogglEvent = z.infer<typeof schema>;

export default schema;
