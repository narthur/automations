import axios from "axios";
import { DynalistFile, Res } from "./dynalist.types";

// https://apidocs.dynalist.io/

const token = "todo";

export const getFiles = makeRoute<
  Record<string, never>,
  {
    root_file_id: string;
    files: DynalistFile[];
  }
>("file/list");

export const updateFile = makePostRoute<
  {
    changes: unknown;
  },
  unknown
>("file/edit");

export const getDocument = makeRoute<
  {
    file_id: string;
  },
  unknown
>("doc/read");

export const getDocumentUpdates = makeRoute<
  {
    file_ids: string[];
  },
  unknown
>("doc/check_for_updates");

export const updateDocument = makePostRoute<
  {
    file_id: string;
    changes: unknown;
  },
  unknown
>("doc/edit");

export const addToInbox = makePostRoute<
  {
    index: number;
    content: string;
    note?: string;
    checked?: boolean;
    checkbox?: boolean;
    heading?: 0 | 1 | 2 | 3;
    color?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  },
  unknown
>("inbox/add");

export const uploadFile = makePostRoute<
  {
    filename: string;
    content_type: string;
    data: string; // base64 encoded
  },
  unknown
>("file/upload");

function makePostRoute<T extends Record<string, unknown>, D>(
  route: string
): (params?: T) => Promise<D> {
  return makeRoute<T, D>(route, { method: "post" });
}

function makeRoute<T extends Record<string, unknown>, D>(
  route: string,
  {
    method = "get",
  }: {
    method?: "get" | "post";
  } = {}
): (params?: T) => Promise<D> {
  return async (params): Promise<D> => {
    const r = await axios<Res<D>>(`https://dynalist.io/api/v1/${route}`, {
      method,
      params: {
        token,
        ...params,
      },
    });

    if (r.data._code !== "OK") {
      throw new Error(r.data._msg);
    }

    return r.data;
  };
}

// TODO: https://axios-http.com/docs/config_defaults

// const api: {
//   get: typeof axios.get;
//   post: typeof axios.post;
// } = {
//   get: (route, config) =>
//     axios.get(`https://dynalist.io/api/v1/${route}`, {
//       ...config,
//       params: { token, ...(config?.params || {}) },
//     }),
//   post: (route, data, config) =>
//     axios.post(`https://dynalist.io/api/v1/${route}`, data, {
//       ...config,
//       params: { token, ...(config?.params || {}) },
//     }),
// };
