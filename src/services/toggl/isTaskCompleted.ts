import { TogglTask } from "./types";

export function isTaskCompleted(task: TogglTask): boolean {
  return !task.active;
}
