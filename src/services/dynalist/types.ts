type Error = {
  _code: "InvalidToken" | "TooManyRequests" | "Invalid" | "LockFile";
  _msg: string;
};

export type Ok<T> = { _code: "OK"; _msg: "" } & T;

export type Res<T> = Error | Ok<T>;

type Document = {
  id: string;
  title: string;
  type: "document";
  permission: 0 | 1 | 2 | 3 | 4;
};

type Folder = {
  id: string;
  title: string;
  type: "folder";
  permission: 0 | 1 | 2 | 3 | 4;
  collapsed: boolean;
  children: string[];
};

export type DynalistFile = Document | Folder;

// https://apidocs.dynalist.io/#get-content-of-a-document
export type DynalistNode = {
  id: string;
  content: string;
  note: string;
  created: number; // timestamp in milliseconds
  modified: number; // timestamp in milliseconds
  children: string[];
  collapsed?: boolean;
  heading?: 0 | 1 | 2 | 3;
  color?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  checked?: boolean;
  checkbox?: boolean;
};

export type NodeAction = NodeInsert | NodeEdit | NodeMove | NodeDelete;

export type NodeInsert = {
  action: "insert";
  parent_id: string;
  index: number;
  content: string;
  note?: string;
  checked?: boolean;
  checkbox?: boolean;
  heading?: 0 | 1 | 2 | 3;
  color?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
};

export type NodeEdit = {
  action: "edit";
  node_id: string;
  content?: string;
  note?: string;
  checked?: boolean;
  checkbox?: boolean;
  heading?: 0 | 1 | 2 | 3;
  color?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
};

export type NodeMove = {
  action: "move";
  node_id: string;
  parent_id: string;
  index: number;
};

export type NodeDelete = {
  action: "delete";
  node_id: string;
};
