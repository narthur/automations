// pnpm dlx tsx ./scripts/trello.ts

import "dotenv/config";

import { TRELLO_INC_BOARD_ID, TRELLO_INC_INBOX_LIST_ID } from "src/secrets.js";
import * as trello from "src/services/trello/index.js";

const secrets = {
  boardId: TRELLO_INC_BOARD_ID.value(),
  inboxId: TRELLO_INC_INBOX_LIST_ID.value(),
};

// const result = await trello.getBoardCards(secrets.boardId);
// const result = await trello.getBoardLists(secrets.boardId);
// const result = await trello.createCard({
//   idList: secrets.inboxId,
//   name: "testing create card",
//   desc: "#source=https://github.com/beeminder/blog/issues/414"
//   urlSource: "https://github.com/beeminder/blog/issues/414",
// });
const result = await trello.getListCards(secrets.inboxId);

console.dir(result, {
  depth: null,
});
