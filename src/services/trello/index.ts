import axios from "axios";
import { TRELLO_API_KEY, TRELLO_API_TOKEN } from "src/secrets.js";
import { TrelloCard } from "./types/TrelloCard.js";
import { TrelloList } from "./types/TrelloList.js";

const axiosInstance = axios.create({
  baseURL: "https://api.trello.com/1",
});

function getAuth() {
  return {
    key: TRELLO_API_KEY.value(),
    token: TRELLO_API_TOKEN.value(),
  };
}

export async function getBoardCards(boardId: string): Promise<TrelloCard[]> {
  const response = await axiosInstance.get<TrelloCard[]>(
    `/boards/${boardId}/cards/all`,
    {
      params: getAuth(),
    }
  );
  return response.data;
}

export async function getBoardLists(boardId: string): Promise<TrelloList[]> {
  const response = await axiosInstance.get<TrelloList[]>(
    `/boards/${boardId}/lists`,
    {
      params: getAuth(),
    }
  );
  return response.data;
}

// https://developer.atlassian.com/cloud/trello/rest/api-group-cards/#api-group-cards
export async function createCard(input: {
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
}) {
  return axiosInstance.post<TrelloCard>("/cards", null, {
    params: {
      ...getAuth(),
      ...input,
    },
  });
}
