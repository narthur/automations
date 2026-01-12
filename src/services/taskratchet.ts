import axios, { type AxiosInstance } from "axios";

import env from "../lib/env.js";

let client: AxiosInstance;

const ONE_DAY = 24 * 60 * 60 * 1000;

function getClient() {
  if (!client) {
    client = axios.create({
      baseURL: "https://api.taskratchet.com/api2",
    });

    const apiToken = env("TASKRATCHET_API_TOKEN");
    if (apiToken) {
      client.defaults.headers.common["Authorization"] = `ApiKey-v2 ${apiToken}`;
    }
  }

  return client;
}

type Task = {
  status: "complete" | "pending" | "expired";
  id: string;
  task: string;
  due: number;
  cents: number;
  complete: boolean;
  chargeStatus?: "notified" | "authorized" | "captured" | undefined;
  contested?: boolean | undefined;
};

export function getTasks(): Promise<Task[]> {
  return getClient()
    .get<Task[]>("/me/tasks")
    .then((r) => r.data);
}

export function getPendingTasks(): Promise<Task[]> {
  return getTasks().then((d) => d.filter((t) => t.status === "pending"));
}

export function getDueTasks() {
  return getPendingTasks().then((r) =>
    r.filter((t) => t.due * 1000 < Date.now() + ONE_DAY)
  );
}
