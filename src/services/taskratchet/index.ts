import env from "../../lib/env.js";
import { OpenAPI, type Task } from "./__generated__/index.js";
import { DefaultService } from "./__generated__/services/DefaultService";

OpenAPI.HEADERS = {
  "X-Taskratchet-Userid": env("TASKRATCHET_USER_ID") || "",
  "X-Taskratchet-Token": env("TASKRATCHET_API_TOKEN") || "",
};

const ONE_DAY = 24 * 60 * 60 * 1000;

export async function getTasks(): Promise<Task[]> {
  return DefaultService.getMeTasks();
}

export async function getPendingTasks(): Promise<Task[]> {
  const d = await DefaultService.getMeTasks();
  return d.filter((t) => t.status === "pending");
}

export async function getDueTasks() {
  const r = await getPendingTasks();
  return r.filter((t) => Number(t.due_timestamp) * 1000 < Date.now() + ONE_DAY);
}

/**
 * Create a TaskRatchet task.
 * Docs: https://taskratchet.com/help/api.html#schema
 *
 * @param task - Task title
 * @param due - Due date and time in string of format 3/25/2020, 11:59 PM
 * @param cents - Stakes in cents
 * @returns Task
 */
export function createTask(task: string, due: string, cents: number) {
  return DefaultService.postMeTasks({
    task,
    due,
    cents,
  });
}
