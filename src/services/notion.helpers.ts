import { z } from "zod";

import {
  NOTION_DATABASE_ID_TODOS,
  NOTION_DATABASE_ID_TR_CARDS,
} from "../secrets.js";

export const DATABASES = z
  .enum(["TASKRATCHET_CARDS", "TODOS"])
  .transform((val) => {
    switch (val) {
      case "TASKRATCHET_CARDS":
        return NOTION_DATABASE_ID_TR_CARDS.value();
      case "TODOS":
        return NOTION_DATABASE_ID_TODOS.value();
      default:
        throw new Error("Invalid database");
    }
  });
