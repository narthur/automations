import { AxiosRequestConfig } from "axios";
import { TogglProject } from "./types.js";
import { api } from "./index.js";

export function getProjects(options: AxiosRequestConfig = {}) {
  return api<TogglProject[]>("me/projects", options);
}
