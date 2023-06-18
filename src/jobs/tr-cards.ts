import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { queryDatabase } from "../services/notion";
import { notionDatabaseIdTrCards } from "../secrets";
import { createDatapoint } from "../services/beeminder";

async function getPage(cursor?: string) {
  return queryDatabase({
    database_id: notionDatabaseIdTrCards.value(),
    start_cursor: cursor,
    page_size: 100,
    filter: {
      timestamp: "last_edited_time",
      last_edited_time: {
        past_week: {},
      },
    },
  });
}

async function getDocs(
  docs: PageObjectResponse[] = [],
  cursor?: string
): Promise<PageObjectResponse[]> {
  const p = await getPage(cursor);
  const d = [...docs, ...p.results] as PageObjectResponse[];

  return p.has_more && p.next_cursor ? getDocs(d, p.next_cursor) : d;
}

async function trCards() {
  const docs = await getDocs();
  const dates = docs.map((doc) => doc.last_edited_time.split("T")[0]);
  const vals = dates.reduce(
    (acc: Record<string, number>, d) => ({
      ...acc,
      [d]: (acc[d] || 0) + 1,
    }),
    {}
  );

  const updates = Object.entries(vals).map(([daystamp, value]) =>
    createDatapoint("narthur", "tr-cards", {
      value,
      daystamp,
    })
  );

  await Promise.all(updates);
}

export default trCards;
