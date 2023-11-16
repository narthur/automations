import { type AxiosRequestConfig } from "axios";
import makeDaystamp from "src/lib/makeDaystamp.js";

import client from "./client.js";
import {
  type TimeEntry,
  type TogglClient,
  type TogglMe,
  type TogglProjectSummaries,
  type TogglTask,
} from "./types.js";

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

export function getMe() {
  return api<TogglMe>("me");
}

export function getProjectSummaries(
  workspaceId: number,
  startDate: Date,
  endDate: Date
) {
  return reports<TogglProjectSummaries>(
    `workspace/${workspaceId}/projects/summary`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        start_date: makeDaystamp(startDate),
        end_date: makeDaystamp(endDate),
      },
    }
  );
}

export function getProjectSummary(
  workspaceId: number,
  projectId: number,
  startDate: Date,
  endDate: Date
) {
  return reports<TogglProjectSummaries>(
    `workspace/${workspaceId}/projects/${projectId}/summary`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        start_date: makeDaystamp(startDate),
        end_date: makeDaystamp(endDate),
      },
    }
  );
}

export async function api<T>(
  p: string,
  o: AxiosRequestConfig = {}
): Promise<T> {
  return client(`api/v9/${p}`, o);
}

export async function reports<T>(
  p: string,
  o: AxiosRequestConfig = {}
): Promise<T> {
  return client(`reports/api/v3/${p}`, o);
}
