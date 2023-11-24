import { type AxiosRequestConfig } from "axios";

import { api } from "./index.js";
import { type TogglTask } from "./types.js";

export function getTasks(
  workspaceId: number,
  projectId: number,
  options: AxiosRequestConfig = {}
) {
  return api<TogglTask[]>(
    `workspaces/${workspaceId}/projects/${projectId}/tasks`,
    options
  );
}
