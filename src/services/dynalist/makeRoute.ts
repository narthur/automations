import axios from "axios";
import Bottleneck from "bottleneck";
import env from "src/lib/env.js";

import { type Ok, type Res } from "./types.js";

// API docs:
// https://apidocs.dynalist.io/

// Setting Axios client defaults:
// https://axios-http.com/docs/config_defaults
// https://stackoverflow.com/a/59050108/937377

const client = axios.create({
  baseURL: "https://dynalist.io/api/v1",
  method: "post",
});

function isOk<T>(r: Record<string, unknown>): r is Ok<T> & { _code: "OK" } {
  return new String(r._code).toLowerCase() === "ok";
}

type RouteOptions = {
  route: string;
  minTime: number;
  maxConcurrent: number;
};

export default function makeRoute<
  T extends Record<string, unknown>,
  D = unknown
>(options: RouteOptions): (params?: T) => Promise<D> {
  const limiter = new Bottleneck({
    minTime: options.minTime,
    maxConcurrent: options.maxConcurrent,
  });

  return async (params): Promise<D> => {
    return limiter.schedule(async (): Promise<D> => {
      const { data } = await client<Res<D>>(options.route, {
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          ...params,
          token: env("DYNALIST_TOKEN"),
        },
      });

      if (!isOk<D>(data)) {
        console.log(data);
        throw new Error(data._msg);
      }

      return data;
    });
  };
}
