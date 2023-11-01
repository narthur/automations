import axios, { AxiosResponse } from "axios";
import { ServerError } from "./types/serverError.js";
import getAuths from "./getAuths.js";

export function api<T>({
  user,
  endpoint,
  method = "GET",
  data,
  params,
}: {
  user: string;
  endpoint: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  data?: Record<string, unknown>;
  params?: Record<string, unknown>;
}): Promise<AxiosResponse<T | ServerError>> {
  const t = getAuths()[user];

  if (!t) {
    throw new Error(`No Beeminder token for ${user}`);
  }

  const url = `https://www.beeminder.com/api/v1/users/${user}/${endpoint}.json`;

  return axios<T | ServerError>({
    method,
    url,
    data,
    params: {
      auth_token: t,
      ...params,
    },
  });
}
