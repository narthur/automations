import { type AxiosRequestConfig } from "axios";

import { api } from "./index.js";
import { type TogglProject } from "./types.js";

export function getProject(
  workspaceId: number,
  projectId: number,
  options: AxiosRequestConfig = {}
) {
  return api<TogglProject>(
    `workspaces/${workspaceId}/projects/${projectId}`,
    options
  );
}
