import { listRows } from "baserow-sdk";
import { TABLES } from "src/services/baserow/constants";
import getEntriesByDate from "src/services/baserow/getEntriesByDate";

import { makeUpdater } from ".";

export type Rate = {
  Rate: string;
  Clients: {
    value: string;
  }[];
  Projects: {
    value: string;
  }[];
};

const CLIENT = "Beeminder";

export const update = makeUpdater({
  user: "narthur",
  goal: "bm",
  getSharedData: async () => {
    const rates = await listRows<Rate>(TABLES.Rates);
    const clientRate = rates
      .filter((r) => r.Clients.some((c) => c.value === CLIENT))
      .sort((a, b) => parseFloat(b.Rate) - parseFloat(a.Rate))[0];

    if (clientRate) {
      return clientRate;
    }

    const baseRate = rates
      .filter((r) => r.Clients.length === 0 && r.Projects.length === 0)
      .sort((a, b) => parseFloat(b.Rate) - parseFloat(a.Rate))[0];

    if (baseRate) {
      return baseRate;
    }

    throw new Error("No base rate found");
  },
  getDateUpdate: async (date, baseRate) => {
    const entries = await getEntriesByDate(date);
    const hours = entries
      .filter((e) => e.Client.some((c) => c.value === CLIENT))
      .reduce(
        (acc, entry) =>
          acc +
          (parseFloat(entry.Hours) * parseFloat(entry.Rate)) /
            parseFloat(baseRate.Rate),
        0
      );

    return {
      value: hours,
    };
  },
});
