import axios, { AxiosRequestConfig } from "axios";
import { TOGGL_API_TOKEN } from "../../secrets.js";

import PQueue from "p-queue";

const _client = axios.create({
  baseURL: "https://api.track.toggl.com",
});

const token = TOGGL_API_TOKEN.value();
const auth = Buffer.from(`${token}:api_token`).toString("base64");

_client.defaults.headers.common.Authorization = `Basic ${auth}`;

const queue = new PQueue({
  intervalCap: 1,
  interval: 1000,
  throwOnTimeout: true,
});

export default async function client<T>(
  p: string,
  o: AxiosRequestConfig = {}
): Promise<T> {
  const result = await queue.add(() =>
    _client(`reports/api/v3/${p}`, o).then((r) => r.data as T)
  );
  // WORKAROUND: https://github.com/sindresorhus/p-queue/issues/175
  if (!result) throw new Error("No Toggl API result");
  return result;
}
