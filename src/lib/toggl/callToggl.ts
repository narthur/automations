import axios, { AxiosPromise, AxiosRequestConfig, AxiosResponse } from "axios";
import { m } from "vitest/dist/index-4a906fa4";

export enum TogglEndpoint {
  Projects = "me/projects",
  TimeEntries = "me/time_entries",
}

export default function callToggl<T>(
  endpoint: TogglEndpoint,
  options: AxiosRequestConfig = {}
): AxiosPromise<T> {
  const url = `https://api.track.toggl.com/api/v9/${endpoint}`;
  const auth = Buffer.from(`${process.env.TOGGL_API_TOKEN}:api_token`).toString(
    "base64"
  );

  return axios(url, {
    headers: {
      Authorization: `Basic ${auth}`,
    },
    ...options,
  }) as AxiosPromise<T>;
}
