type Error = {
  _code: "InvalidToken" | "TooManyRequests" | "Invalid" | "LockFile";
  _msg: string;
};

type Ok<T> = { _code: "OK"; _msg: "" } & T;

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

export type DynalistNode = {
  id: string;
  content: string;
  note: string;
  created: number;
  modified: number;
  children: string[];
  collapsed?: boolean;
  heading?: 0 | 1 | 2 | 3;
  color?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  checked?: boolean;
  checkbox?: boolean;
};
