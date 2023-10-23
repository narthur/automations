import axios from "axios";
import { TRELLO_API_KEY, TRELLO_API_TOKEN } from "src/secrets.js";
import { TrelloCard } from "./types/TrelloCard.js";
import { TrelloList } from "./types/TrelloList.js";
import { TrelloCardInput } from "./types/TrelloCardInput.js";

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

// https://developer.atlassian.com/cloud/trello/rest/api-group-cards/#api-group-cards
export async function createCard(input: TrelloCardInput) {
  return client.post<TrelloCard>("/cards", null, {
    params: {
      ...getAuth(),
      ...input,
    },
  });
}
