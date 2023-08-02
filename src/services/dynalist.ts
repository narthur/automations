import axios from "axios";
import { DynalistFile, Res } from "./dynalist.types";

// https://apidocs.dynalist.io/

const TOKEN = "todo";

export function getFiles() {
  return axios.get<
    Res<{
      root_file_id: string;
      files: DynalistFile[];
    }>
  >("https://dynalist.io/api/v1/file/list", {
    params: {
      token: TOKEN,
    },
  });
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
