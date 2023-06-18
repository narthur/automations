import { Client } from "@notionhq/client";
import { notionDatabaseIdTrCards } from "../secrets";
import {
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
      auth: notionDatabaseIdTrCards.value(),
    });
  }

  return client;
}

export function queryDatabase(
  options: QueryDatabaseOptions
): Promise<QueryDatabaseResponse> {
  return getNotion().databases.query(options);
}
