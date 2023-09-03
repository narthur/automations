import { notionDatabaseIdTodos, notionDatabaseIdTrCards } from "../secrets.js";
import { z } from "zod";

export const DATABASES = z
  .enum(["TASKRATCHET_CARDS", "TODOS"])
  .transform((val) => {
    switch (val) {
      case "TASKRATCHET_CARDS":
        return notionDatabaseIdTrCards.value();
      case "TODOS":
        return notionDatabaseIdTodos.value();
      default:
        throw new Error("Invalid database");
    }
  });
