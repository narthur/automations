import axios from "axios";
import { TRELLO_API_KEY, TRELLO_API_TOKEN } from "src/secrets.js";

import { SearchInput } from "./types/SearchInput.js";
import { TrelloCard } from "./types/TrelloCard.js";
import { TrelloCardInput } from "./types/TrelloCardInput.js";
import { TrelloList } from "./types/TrelloList.js";

const client = axios.create({
  baseURL: "https://api.trello.com/1",
});

function getAuth() {
  return {
    key: TRELLO_API_KEY.value(),
    token: TRELLO_API_TOKEN.value(),
  };
}

export async function getBoardCards(boardId: string): Promise<TrelloCard[]> {
  const response = await client.get<TrelloCard[]>(
    `/boards/${boardId}/cards/all`,
    {
      params: getAuth(),
    }
  );
  return response.data;
}

export async function getBoardLists(boardId: string): Promise<TrelloList[]> {
  const response = await client.get<TrelloList[]>(`/boards/${boardId}/lists`, {
    params: getAuth(),
  });
  return response.data;
}

// https://developer.atlassian.com/cloud/trello/rest/api-group-cards/#api-cards-post
export async function createCard(input: TrelloCardInput) {
  return client.post<TrelloCard>("/cards", null, {
    params: {
      ...getAuth(),
      ...input,
    },
  });
}

export async function getListCards(listId: string) {
  const response = await client.get<TrelloCard[]>(`/lists/${listId}/cards`, {
    params: getAuth(),
  });
  return response.data;
}

// https://developer.atlassian.com/cloud/trello/rest/api-group-search/#api-search-get
export async function search(input: SearchInput) {
  const response = await client.get<TrelloCard[]>(`/search`, {
    params: {
      ...getAuth(),
      ...input,
    },
  });
  return response.data;
}
