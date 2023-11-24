import { runQuery } from "src/services/index.js";
import getTimeSummary from "src/services/toggl/getTimeSummary.js";
import {
  type TogglTimeSummaryEntry,
  type TogglTimeSummaryGroup,
} from "src/services/toggl/types.js";

import { makeUpdater } from "./index.js";

const SECONDS_IN_HOUR = 3600;

function sumRates(rates: TogglTimeSummaryEntry["rates"]): number {
  return rates.reduce<number>((acc, rate) => {
    const hours = rate.billable_seconds / SECONDS_IN_HOUR;
    const cents = hours * rate.hourly_rate_in_cents;
    const dollars = cents / 100;
    return acc + dollars;
  }, 0);
}

function sumEntries(entries: TogglTimeSummaryEntry[]): number {
  return entries.reduce((acc, entry) => acc + sumRates(entry.rates), 0);
}

function sumUser(
  user: TogglTimeSummaryGroup,
  me: {
    id: string;
  }
): number {
  const entries = user?.sub_groups ?? [];
  const multiplier = user.id.toString() === me.id ? 1 : 0.3;
  return sumEntries(entries) * multiplier;
}

export const update = makeUpdater({
  user: "narthur",
  goal: "gross",
  getSharedData: () => {
    return runQuery<{
      togglMe: {
        id: string;
        default_workspace_id: number;
      };
    }>(`
    query {
      togglMe {
        id
        default_workspace_id
      }
    }
    `);
  },
  getDateUpdate: async (date, { togglMe }) => {
    const { groups } = await getTimeSummary({
      workspaceId: togglMe.default_workspace_id,
      startDate: date,
      endDate: date,
      billable: true,
      grouping: "users",
    });

    const sums = groups.map((group) => [group.id, sumUser(group, togglMe)]);
    const value = sums.reduce((acc, [, sum]) => acc + (sum ?? 0), 0);
    const comment = `updated ${new Date().toLocaleString()}: ${JSON.stringify(
      sums
    )}`;

    return {
      value,
      comment,
    };
  },
});
