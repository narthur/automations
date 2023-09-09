import axios, { AxiosRequestConfig } from "axios";
import { togglApiToken } from "../../secrets.js";
import { TimeEntry, TogglClient, TogglProject, TogglTask } from "./types.js";
import PQueue from "p-queue";

const client = axios.create({
  baseURL: "https://api.track.toggl.com/api/v9",
});

const token = togglApiToken.value();
const auth = Buffer.from(`${token}:api_token`).toString("base64");
client.defaults.headers.common["Authorization"] = `Basic ${auth}`;

export function getProjects(options: AxiosRequestConfig = {}) {
  return api<TogglProject[]>("me/projects", options);
}

export function getTimeEntries(options: AxiosRequestConfig = {}) {
  return api<TimeEntry[]>("me/time_entries", options);
}

export function getClient(
  workspaceId: number,
  clientId: number,
  options: AxiosRequestConfig = {}
) {
  return api<TogglClient>(
    `workspaces/${workspaceId}/clients/${clientId}`,
    options
  );
}

export function getClients(
  workspaceId: number,
  options: AxiosRequestConfig = {}
) {
  return api<TogglClient[]>(`workspaces/${workspaceId}/clients`, options);
}

export function getTasks(
  workspaceId: number,
  projectId: number,
  options: AxiosRequestConfig = {}
) {
  return api<TogglTask[]>(
    `workspaces/${workspaceId}/projects/${projectId}/tasks`,
    options
  );
}

const queue = new PQueue({
  intervalCap: 1,
  interval: 1000,
  throwOnTimeout: true,
});

async function api<T>(p: string, o: AxiosRequestConfig = {}): Promise<T> {
  const result = await queue.add(() => client(p, o).then((r) => r.data as T));
  // WORKAROUND: https://github.com/sindresorhus/p-queue/issues/175
  if (!result) throw new Error("No Toggl API result");
  return result;
}
