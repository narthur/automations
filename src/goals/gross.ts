import getTimeSummary from "src/services/toggl/getTimeSummary.js";
import {
  type TogglMe,
  type TogglTimeSummaryEntry,
  type TogglTimeSummaryGroup,
} from "src/services/toggl/types.js";

import { getMe } from "../services/toggl/index.js";
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

function sumUser(user: TogglTimeSummaryGroup, me: TogglMe): number {
  const entries = user?.sub_groups ?? [];
  const multiplier = user.id === me.id ? 1 : 0.3;
  return sumEntries(entries) * multiplier;
}

async function getDateUpdate(date: Date, me: TogglMe) {
  const { groups } = await getTimeSummary({
    workspaceId: me.default_workspace_id,
    startDate: date,
    endDate: date,
    billable: true,
    grouping: "users",
  });

  const sums = groups.map((group) => [group.id, sumUser(group, me)]);
  const value = sums.reduce((acc, [, sum]) => acc + (sum ?? 0), 0);
  const comment = `updated ${new Date().toLocaleString()}: ${JSON.stringify(
    sums
  )}`;

  return {
    value,
    comment,
  };
}

export const update = makeUpdater({
  user: "narthur",
  goal: "gross",
  getSharedData: getMe,
  getDateUpdate,
});
