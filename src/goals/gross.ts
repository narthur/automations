import { getMe } from "../services/toggl/index.js";
import { createDatapoint } from "../services/beeminder.js";
import {
  TogglMe,
  TogglTimeSummaryEntry,
  TogglTimeSummaryGroup,
} from "src/services/toggl/types.js";
import getWeekDates from "src/effects/getWeekDates.js";
import getTimeSummary from "src/services/toggl/getTimeSummary.js";

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
  const daystamp = date.toISOString().split("T")[0];

  const { groups } = await getTimeSummary({
    workspaceId: me.default_workspace_id,
    startDate: date,
    endDate: date,
    billable: true,
    grouping: "users",
  });

  const value = groups.reduce((acc, user) => acc + sumUser(user, me), 0);

  await createDatapoint("narthur", "gross", {
    value,
    daystamp,
    requestid: daystamp,
  });
}

export async function update() {
  const dates = getWeekDates();
  const me = await getMe();
  await Promise.all(dates.map((d) => doUpdate(d, me)));
}
