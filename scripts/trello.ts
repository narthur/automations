// pnpm dlx tsx ./scripts/trello.ts

import "dotenv/config";
import * as trello from "src/services/trello/index.js";
import { TRELLO_INC_BOARD_ID, TRELLO_INC_INBOX_LIST_ID } from "src/secrets.js";

const secrets = {
  boardId: TRELLO_INC_BOARD_ID.value(),
  inboxId: TRELLO_INC_INBOX_LIST_ID.value(),
};

const result = await trello.getBoardCards(secrets.boardId);
// const result = await trello.getBoardLists(secrets.boardId);
// const result = await trello.createCard({
//   idList: secrets.inboxId,
//   name: "testing create card",
// });

console.log(result);
