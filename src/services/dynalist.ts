import axios from "axios";
import { DynalistFile, DynalistNode, Res } from "./dynalist.types.js";
import { DYNALIST_TOKEN } from "src/secrets.js";

// API docs:
// https://apidocs.dynalist.io/

// Setting Axios client defaults:
// https://axios-http.com/docs/config_defaults
// https://stackoverflow.com/a/59050108/937377

const client = axios.create({
  baseURL: "https://dynalist.io/api/v1",
});

client.interceptors.request.use((config) => {
  // WORKAROUND: eslint rules disabled because the upstream type
  // defines params as `any`.

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  config.params = config.params || {};
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  config.params.token = DYNALIST_TOKEN.value();
  return config;
});

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
  {
    _code: string;
    _msg: string;
    file_id: string;
    title: string;
    nodes: DynalistNode[];
    version: number;
  }
>("doc/read");

export const getDocumentUpdates = makeRoute<
  {
    file_ids: string[];
  },
  {
    _code: string;
    _msg: string;
    versions: Record<string, number>;
  }
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
  return makeRoute<T, D>(route);
}

function makeRoute<T extends Record<string, unknown>, D>(
  route: string
): (params?: T) => Promise<D> {
  return async (params): Promise<D> => {
    const r = await client<Res<D>>(route, {
      method: "post",
      params,
    });

    if (r.data._code !== "OK") {
      throw new Error(r.data._msg);
    }

    return r.data;
  };
}
