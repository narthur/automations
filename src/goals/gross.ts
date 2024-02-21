import getEntriesByDate from "src/services/baserow/getEntriesByDate.js";

import { makeUpdater } from "./index.js";

export const update = makeUpdater({
  user: "narthur",
  goal: "gross",
  getDateUpdate: async (date) => {
    const entries = await getEntriesByDate(date);

    return {
      value: entries.reduce((acc, row) => acc + parseFloat(row.Net), 0),
    };
  },
});
