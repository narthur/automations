import { Client } from "@notionhq/client";
import { notionApiKey } from "../secrets";
import {
  CreatePageResponse,
  QueryDatabaseParameters,
  QueryDatabaseResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { z } from "zod";
import { DATABASES } from "./notion.helpers";

type QueryDatabaseOptions = {
  auth?: string;
} & QueryDatabaseParameters;

let client: Client | null = null;

function getNotion() {
  if (!client) {
    client = new Client({
      auth: notionApiKey.value(),
    });
  }

  return client;
}

export function queryDatabase(
  options: QueryDatabaseOptions
): Promise<QueryDatabaseResponse> {
  return getNotion().databases.query(options);
}

export function addDocument({
  database,
  title,
  content,
}: {
  database: z.infer<typeof DATABASES>;
  title: string;
  content: string;
}): Promise<CreatePageResponse> {
  return getNotion().pages.create({
    parent: {
      database_id: DATABASES.parse(database),
    },
    properties: {
      Name: {
        title: [
          {
            type: "text",
            text: {
              content: title,
            },
          },
        ],
      },
      Content: {
        rich_text: [
          {
            type: "text",
            text: {
              content,
            },
          },
        ],
      },
    },
  });
}
