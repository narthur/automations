import axios, { AxiosInstance } from "axios";
import { taskratchetApiToken, taskratchetUserId } from "../secrets";

let client: AxiosInstance;

function getClient() {
  if (!client) {
    client = axios.create({
      baseURL: "https://api.taskratchet.com/api1",
    });

    client.defaults.headers.common["X-Taskratchet-Userid"] =
      taskratchetUserId.value();
    client.defaults.headers.common["X-Taskratchet-Token"] =
      taskratchetApiToken.value();
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
