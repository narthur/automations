import axios from "axios";
import { TRELLO_API_KEY, TRELLO_API_TOKEN } from "src/secrets.js";
import { TrelloCard } from "./types/TrelloCard.js";

const axiosInstance = axios.create({
  baseURL: "https://api.trello.com/1",
});

type TrelloCardResponse = TrelloCard[];

export async function fetchCards(boardId: string) {
  const response = await axiosInstance.get<TrelloCardResponse>(
    `/boards/${boardId}/cards/all`,
    {
      params: {
        key: TRELLO_API_KEY.value(),
        token: TRELLO_API_TOKEN.value(),
      },
    }
  );
  return response.data;
}
