import { type AxiosRequestConfig } from "axios";
import { type TogglTask } from "./types.js";
import { api } from "./index.js";

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
