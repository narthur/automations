export type TrelloCardInput = {
  name?: string;
  desc?: string;
  pos?: "top" | "bottom" | number;
  due?: string;
  start?: string;
  dueComplete?: boolean;
  idList: string;
  idMembers?: string[];
  idLabels?: string[];
  urlSource?: string;
  fileSource?: string;
  mimeType?: string;
  idCardSource?: string;
  keepFromSource?: string;
  address?: string;
  locationName?: string;
  coordinates?: string;
};
