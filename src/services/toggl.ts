import axios, { AxiosRequestConfig } from "axios";
import { togglApiToken } from "../secrets";
import { TimeEntry, TogglProject, TogglTask } from "./toggl.types";

export function getProjects(options: AxiosRequestConfig = {}) {
  return api<TogglProject[]>("me/projects", options);
}

export function getTimeEntries(options: AxiosRequestConfig = {}) {
  return api<TimeEntry[]>("me/time_entries", options);
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

async function api<T>(p: string, o: AxiosRequestConfig = {}): Promise<T> {
  const u = `https://api.track.toggl.com/api/v9/${p}`;
  const t = togglApiToken.value();
  const a = Buffer.from(`${t}:api_token`).toString("base64");

  const r = await axios(u, {
    headers: {
      Authorization: `Basic ${a}`,
    },
    ...o,
  }).catch((err) => {
    console.error("Error while calling Toggl API", {
      endpoint: p,
      url: u,
      options: o,
      token: t,
      auth: a,
    });
    throw err;
  });

  return r.data as T;
}
