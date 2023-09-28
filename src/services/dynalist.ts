import axios from "axios";
import { DynalistFile, DynalistNode, Ok, Res } from "./dynalist.types.js";
import { DYNALIST_TOKEN } from "src/secrets.js";

// API docs:
// https://apidocs.dynalist.io/

// Setting Axios client defaults:
// https://axios-http.com/docs/config_defaults
// https://stackoverflow.com/a/59050108/937377

const client = axios.create({
  baseURL: "https://dynalist.io/api/v1",
  method: "post",
});

export const getFiles = makeRoute<
  Record<string, never>,
  {
    root_file_id: string;
    files: DynalistFile[];
  }
>("file/list");

export const updateFile = makeRoute<{
  changes: unknown;
}>("file/edit");

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

export const updateDocument = makeRoute<{
  file_id: string;
  changes: unknown;
}>("doc/edit");

export const addToInbox = makeRoute<{
  index: number;
  content: string;
  note?: string;
  checked?: boolean;
  checkbox?: boolean;
  heading?: 0 | 1 | 2 | 3;
  color?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
}>("inbox/add");

export const uploadFile = makeRoute<{
  filename: string;
  content_type: string;
  data: string; // base64 encoded
}>("file/upload");

function isOk<T>(r: Record<string, unknown>): r is Ok<T> & { _code: "OK" } {
  return new String(r._code).toLowerCase() === "ok";
}

function makeRoute<T extends Record<string, unknown>, D = unknown>(
  route: string
): (params?: T) => Promise<D> {
  return async (params): Promise<D> => {
    const { data } = await client<Res<D>>(route, {
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        ...params,
        token: DYNALIST_TOKEN.value(),
      },
    });

    if (!isOk<D>(data)) {
      console.log(data);
      throw new Error(data._msg);
    }

    return data;
  };
}
