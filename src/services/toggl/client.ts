import axios, { type AxiosRequestConfig } from "axios";
import PQueue from "p-queue";

import env from "../../lib/env.js";

const _client = axios.create({
  baseURL: "https://api.track.toggl.com",
});

const token = env("TOGGL_API_TOKEN");
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
  const result = await queue.add(() => _client(p, o).then((r) => r.data as T));
  // WORKAROUND: https://github.com/sindresorhus/p-queue/issues/175
  if (!result) throw new Error("No Toggl API result");
  return result;
}
