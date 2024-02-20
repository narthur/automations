import { TABLES } from "src/services/baserow/constants.js";
import { listRows } from "src/services/baserow/listRows.js";

import { makeUpdater } from "./index.js";

function formatDateString(date: Date, tz: string): string {
  const year = date.getFullYear();
  const month = `0${date.getMonth() + 1}`.slice(-2); // Months are 0-based in JS
  const day = `0${date.getDate()}`.slice(-2); // Pad with a zero if needed

  return `${tz}?${year}-${month}-${day}`;
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
            type: "date_equal",
            field: "End",
            value: formatDateString(date, "America/Detroit"),
          },
        ],
      },
    });

    return {
      value: rows.reduce((acc, row) => acc + parseFloat(row.Net), 0),
    };
  },
});
