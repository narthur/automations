import { Client } from "@notionhq/client";
import {
  type CreatePageResponse,
  type QueryDatabaseParameters,
  type QueryDatabaseResponse,
} from "@notionhq/client/build/src/api-endpoints.js";
import { z } from "zod";

import { NOTION_API_KEY } from "../secrets.js";
import { DATABASES } from "./notion.helpers.js";

type QueryDatabaseOptions = {
  auth?: string;
} & QueryDatabaseParameters;

let client: Client | null = null;

function getNotion() {
  if (!client) {
    client = new Client({
      auth: NOTION_API_KEY.value(),
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
  database: z.output<typeof DATABASES>;
  title: string;
  content: string;
}): Promise<CreatePageResponse> {
  return getNotion().pages.create({
    parent: {
      database_id: database,
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
    },
    children: [
      {
        object: "block",
        type: "paragraph",
        paragraph: {
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
    ],
  });
}
