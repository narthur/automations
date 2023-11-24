import { type AxiosRequestConfig } from "axios";

import client from "./client.js";

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
