import axios from "axios";
import { DynalistFile, Res } from "./dynalist.types";

// https://apidocs.dynalist.io/

const TOKEN = "todo";

type GetFilesResponse = {
  root_file_id: string;
  files: DynalistFile[];
};

export async function getFiles(): Promise<GetFilesResponse> {
  const r = await axios.get<Res<GetFilesResponse>>(
    "https://dynalist.io/api/v1/file/list",
    {
      params: {
        token: TOKEN,
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
    token: TOKEN,
    changes,
  });
}

export function getDocument(fileId: string) {
  return axios.get("https://dynalist.io/api/v1/doc/read", {
    params: {
      token: TOKEN,
      file_id: fileId,
    },
  });
}

export function getDocumentUpdates(fileIds: string[]) {
  return axios.get("https://dynalist.io/api/v1/doc/read", {
    params: {
      token: TOKEN,
      file_ids: fileIds,
    },
  });
}

export function updateDocument(fileId: string, changes: unknown) {
  return axios.post("https://dynalist.io/api/v1/doc/edit", {
    token: TOKEN,
    file_id: fileId,
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
    token: TOKEN,
    ...options,
  });
}

export function uploadFile(options: {
  filename: string;
  content_type: string;
  data: string; // base64 encoded
}) {
  return axios.post("https://dynalist.io/api/v1/file/upload", {
    token: TOKEN,
    ...options,
  });
}
