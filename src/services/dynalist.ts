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

export function getDocumentUpdates(file_ids: string[]) {
  return axios.get("https://dynalist.io/api/v1/doc/read", {
    params: {
      token,
      file_ids,
    },
  });
}

export function updateDocument(file_id: string, changes: unknown) {
  return axios.post("https://dynalist.io/api/v1/doc/edit", {
    token,
    file_id,
    changes,
  });
}

export function addToInbox(options: {
  index: number;
  content: string;
  note?: string;
  checked?: boolean;
  checkbox?: boolean;
  heading?: 0 | 1 | 2 | 3;
  color?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
}) {
  return axios.post("https://dynalist.io/api/v1/inbox/add", {
    token,
    ...options,
  });
}

export function uploadFile(options: {
  filename: string;
  content_type: string;
  data: string; // base64 encoded
}) {
  return axios.post("https://dynalist.io/api/v1/file/upload", {
    token,
    ...options,
  });
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
