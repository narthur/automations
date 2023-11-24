import { type AxiosRequestConfig } from "axios";
import { type TogglClient } from "./types.js";
import { api } from "./index.js";

export function getClient(
  workspaceId: number,
  clientId: number,
  options: AxiosRequestConfig = {}
) {
  return api<TogglClient>(
    `workspaces/${workspaceId}/clients/${clientId}`,
    options
  );
}
