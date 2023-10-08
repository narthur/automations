import { getMe } from "../services/toggl/index.js";
import { createDatapoint } from "../services/beeminder.js";
import {
  TogglMe,
  TogglTimeSummaryEntry,
  TogglTimeSummaryGroup,
} from "src/services/toggl/types.js";
import getWeekDates from "src/effects/getWeekDates.js";
import getTimeSummary from "src/services/toggl/getTimeSummary.js";
import makeDaystamp from "src/transforms/makeDaystamp.js";

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

async function doUpdate(date: Date, me: TogglMe) {
  const daystamp = makeDaystamp(date);

  const { groups } = await getTimeSummary({
    workspaceId: me.default_workspace_id,
    startDate: date,
    endDate: date,
    billable: true,
    grouping: "users",
  });

  console.log(date, me, groups);

  const sums = groups.map((group) => [group.id, sumUser(group, me)]);
  const value = sums.reduce((acc, [, sum]) => acc + sum, 0);
  const comment = `updated ${new Date().toLocaleString()}: ${JSON.stringify(
    sums
  )}`;

  await createDatapoint("narthur", "gross", {
    value,
    daystamp,
    requestid: daystamp,
    comment,
  });
}

export async function update() {
  const dates = getWeekDates();
  const me = await getMe();
  await Promise.all(dates.map((d) => doUpdate(d, me)));
}
