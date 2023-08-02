import axios from "axios";
import { DynalistFile, Res } from "./dynalist.types";

// https://apidocs.dynalist.io/

const token = "todo";

type GetFilesResponse = {
  root_file_id: string;
  files: DynalistFile[];
};

export async function getFiles(): Promise<GetFilesResponse> {
  const r = await axios.get<Res<GetFilesResponse>>(
    "https://dynalist.io/api/v1/file/list",
    {
      params: {
        token,
      },
    }
  );

  if (r.data._code !== "OK") {
    throw new Error(r.data._msg);
  }

  return r.data;
}

export function updateFile(changes: unknown) {
  return axios.post("https://dynalist.io/api/v1/file/edit", {
    token,
    changes,
  });
}

export function getDocument(file_id: string) {
  return axios.get("https://dynalist.io/api/v1/doc/read", {
    params: {
      token,
      file_id,
    },
  });
}

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
