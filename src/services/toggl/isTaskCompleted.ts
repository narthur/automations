import { TogglTask } from "./types.js";

export function isTaskCompleted(task: TogglTask): boolean {
  return !task.active;
}
