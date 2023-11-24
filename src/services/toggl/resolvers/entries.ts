import { type AxiosRequestConfig } from "axios";
import type { TimeEntry } from "src/__generated__/graphql.js";

import { api } from "../index.js";

type RawTimeEntry = {
  at: string;
  billable: boolean;
  description: string;
  // In seconds. Time entry duration. For running entries should be negative, preferable -1
  duration: number;
  duronly: boolean;
  id: number;
  // Project ID, legacy field
  pid: number;
  // Project ID. Can be null if project was not provided or project was later deleted
  project_id?: number;
  server_deleted_at: string;
  // Start time in UTC
  start: string;
  // Stop time in UTC, can be null if it's still running or created with "duration" and "duronly" fields
  stop?: string;
  tag_ids: number[];
  tags: string[];
  task_id: number;
  tid: number;
  uid: number;
  user_id: number;
  wid: number;
  workspace_id: number;
};

export default async function entries(
  options: AxiosRequestConfig = {}
): Promise<TimeEntry[]> {
  const rawTimeEntries = await api<RawTimeEntry[]>("me/time_entries", options);

  return rawTimeEntries.map((e) => ({
    ...e,
    id: e.id.toString(),
    projectId: e.project_id ?? null,
    serverDeletedAt: e.server_deleted_at,
    stop: e.stop ?? null,
    tagIds: e.tag_ids,
    taskId: e.task_id,
    userId: e.user_id,
    workspaceId: e.workspace_id,
  }));
}
