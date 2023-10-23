// pnpm dlx tsx ./scripts/getCards.ts

import { fetchCards } from "src/services/trello/index.js";
import "dotenv/config";
import { TRELLO_INC_BOARD_ID } from "src/secrets.js";

const boardId = TRELLO_INC_BOARD_ID.value();
const result = await fetchCards(boardId);

console.log(result);
