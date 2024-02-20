import { TABLES } from "src/services/baserow/constants.js";
import { listRows } from "src/services/baserow/listRows.js";

import { makeUpdater } from "./index.js";

function formatDateString(date: Date, tz: string): string {
  const year = date.getFullYear();
  const month = `0${date.getMonth() + 1}`.slice(-2); // Months are 0-based in JS
  const day = `0${date.getDate()}`.slice(-2); // Pad with a zero if needed

  return `${tz}?${year}-${month}-${day}`;
}

function getPreviousDay(date: Date): Date {
  const prevDay = new Date(date);
  prevDay.setDate(date.getDate() - 1);
  return prevDay;
}

export const update = makeUpdater({
  user: "narthur",
  goal: "gross",
  getDateUpdate: async (date) => {
    const rows = await listRows<{
      Net: string; // "0.00"
    }>(TABLES.Entries, {
      filters: {
        filters: [
          {
            type: "date_before",
            field: "End",
            value: formatDateString(date, "America/Detroit"),
          },
          {
            type: "date_after_or_equal",
            field: "End",
            value: formatDateString(getPreviousDay(date), "America/Detroit"),
          },
        ],
      },
    });

    return {
      value: rows.reduce((acc, row) => acc + parseFloat(row.Net), 0),
    };
  },
});
