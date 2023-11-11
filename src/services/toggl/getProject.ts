import { AxiosRequestConfig } from "axios";

import { api } from "./index.js";
import { TogglProject } from "./types.js";

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
