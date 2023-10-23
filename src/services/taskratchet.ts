import axios, { AxiosInstance } from "axios";
import { TASKRATCHET_API_TOKEN, TASKRATCHET_USER_ID } from "../secrets.js";

let client: AxiosInstance;

const ONE_DAY = 24 * 60 * 60 * 1000;

function getClient() {
  if (!client) {
    client = axios.create({
      baseURL: "https://api.taskratchet.com/api1",
    });

    client.defaults.headers.common["X-Taskratchet-Userid"] =
      TASKRATCHET_USER_ID.value();
    client.defaults.headers.common["X-Taskratchet-Token"] =
      TASKRATCHET_API_TOKEN.value();
  }

  return client;
}

type Task = {
  id: string;
  task: string;
  due: string;
  due_timestamp: number;
  cents: number;
  complete: boolean;
  status: "complete" | "expired" | "pending";
  timezone: string;
};

export function getTasks() {
  return getClient().get<Task[]>("/me/tasks");
}

export function getPendingTasks() {
  return getTasks().then((r) => r.data.filter((t) => t.status === "pending"));
}

export function getDueTasks() {
  return getPendingTasks().then((r) =>
    r.filter((t) => t.due_timestamp < Date.now() + ONE_DAY)
  );
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
  return getClient().post<Task>("/me/tasks", {
    task,
    due,
    cents,
  });
}
