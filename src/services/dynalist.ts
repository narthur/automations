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

export const updateFile = makeRoute<
  {
    changes: unknown;
  },
  unknown
>("file/edit", {
  method: "post",
});

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

export const updateDocument = makeRoute<
  {
    file_id: string;
    changes: unknown;
  },
  unknown
>("doc/edit", {
  method: "post",
});

export const addToInbox = makeRoute<
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
>("inbox/add", {
  method: "post",
});

export const uploadFile = makeRoute<
  {
    filename: string;
    content_type: string;
    data: string; // base64 encoded
  },
  unknown
>("file/upload", {
  method: "post",
});

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
