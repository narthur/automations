import makeRoute from "./makeRoute.js";
import {
  type DynalistFile,
  type DynalistNode,
  type NodeAction,
} from "./types.js";

// API docs:
// https://apidocs.dynalist.io/

export const getFiles = makeRoute<
  Record<string, never>,
  {
    root_file_id: string;
    files: DynalistFile[];
  }
>({
  route: "file/list",
  minTime: 10000, // 6 requests per minute
  maxConcurrent: 10,
});

export const updateFile = makeRoute<{
  changes: unknown;
}>({
  route: "file/edit",
  minTime: 1000, // 60 requests per minute
  maxConcurrent: 50,
});

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
>({
  route: "doc/read",
  minTime: 2000, // 30 requests per minute
  maxConcurrent: 100,
});

export const getDocumentUpdates = makeRoute<
  {
    file_ids: string[];
  },
  {
    _code: string;
    _msg: string;
    versions: Record<string, number>;
  }
>({
  route: "doc/check_for_updates",
  minTime: 1000, // 60 requests per minute
  maxConcurrent: 50,
});

export const updateDocument = makeRoute<{
  file_id: string;
  changes: NodeAction[];
}>({
  route: "doc/edit",
  minTime: 1000, // 60 requests per minute
  maxConcurrent: 20,
});

export const addToInbox = makeRoute<{
  index: number;
  content: string;
  note?: string;
  checked?: boolean;
  checkbox?: boolean;
  heading?: 0 | 1 | 2 | 3;
  color?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
}>({
  route: "inbox/add",
  minTime: 1000, // 60 requests per minute
  maxConcurrent: 20,
});

export const uploadFile = makeRoute<{
  filename: string;
  content_type: string;
  data: string; // base64 encoded
}>({
  route: "file/upload",
  minTime: 30000, // 2 requests per minute
  maxConcurrent: 5,
});
