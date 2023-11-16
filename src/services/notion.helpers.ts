import { z } from "zod";

import env from "../lib/env.js";

export const DATABASES = z
  .enum(["TASKRATCHET_CARDS", "TODOS"])
  .transform((val) => {
    const trCards = env("NOTION_DATABASE_ID_TR_CARDS");
    const todos = env("NOTION_DATABASE_ID_TODOS");

    if (!trCards || !todos) {
      throw new Error("Missing database ID");
    }

    switch (val) {
      case "TASKRATCHET_CARDS":
        return trCards;
      case "TODOS":
        return todos;
      default:
        throw new Error("Invalid database");
    }
  });
