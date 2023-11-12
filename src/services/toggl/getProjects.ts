import { AxiosRequestConfig } from "axios";

import { api } from "./index.js";
import { TogglProject } from "./types.js";

export function getProjects(options: AxiosRequestConfig = {}) {
  return api<TogglProject[]>("me/projects", options);
}
