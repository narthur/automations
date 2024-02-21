import { configure, listRows } from "baserow-sdk";
import env from "src/lib/env";

import { TABLES } from "./constants";
import makeFilters from "./makeFilters";

type Entry = {
  Net: string; // "0.00",
  Hours: string; // "0.00",
  Rate: string; // "0.00",
  Client: {
    value: string;
  }[];
};

const TIMEZONE = "America/Detroit";

configure({
  baseUrl: env("BASEROW_DOMAIN"),
  headers: {
    "Content-Type": "application/json",
    Authorization: `Token ${env("BASEROW_DATABASE_TOKEN")}`,
  },
});

function formatDateString(date: Date, tz: string): string {
  const year = date.getFullYear();
  const month = `0${date.getMonth() + 1}`.slice(-2); // Months are 0-based in JS
  const day = `0${date.getDate()}`.slice(-2); // Pad with a zero if needed

  return `${tz}?${year}-${month}-${day}`;
}

export default function getEntriesByDate(date: Date) {
  return listRows<Entry>(TABLES.Entries, {
    filters: makeFilters([
      {
        type: "date_equal",
        field: "End",
        value: formatDateString(date, TIMEZONE),
      },
    ]),
  });
}
