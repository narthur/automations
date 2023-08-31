import { Client } from "@notionhq/client";
import { notionApiKey } from "../secrets";
import {
  CreatePageParameters,
  CreatePageResponse,
  QueryDatabaseParameters,
  QueryDatabaseResponse,
} from "@notionhq/client/build/src/api-endpoints";

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

export function addDocument(
  database_id: string,
  properties: CreatePageParameters["properties"]
): Promise<CreatePageResponse> {
  return getNotion().pages.create({
    parent: {
      database_id,
    },
    properties,
  });
}
