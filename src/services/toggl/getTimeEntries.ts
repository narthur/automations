import { type AxiosRequestConfig } from "axios";

import { api } from "./index.js";
import { type TimeEntry } from "./types.js";

export function getTimeEntries(options: AxiosRequestConfig = {}) {
  return api<TimeEntry[]>("me/time_entries", options);
}
