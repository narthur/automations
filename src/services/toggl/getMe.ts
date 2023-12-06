import { type TogglMe } from "./types.js";
import { api } from "./index.js";

export function getMe() {
  return api<TogglMe>("me");
}
