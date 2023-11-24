import { type AxiosRequestConfig } from "axios";

import { api } from "./index.js";
import { type TogglClient } from "./types.js";

export function getClients(
  workspaceId: number,
  options: AxiosRequestConfig = {}
) {
  return api<TogglClient[]>(`workspaces/${workspaceId}/clients`, options);
}
