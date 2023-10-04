import { getMe } from "../services/toggl/index.js";
import { createDatapoint } from "../services/beeminder.js";
import { TogglMe, TogglTimeSummaryGroup } from "src/services/toggl/types.js";
import getWeekDates from "src/effects/getWeekDates.js";
import getTimeSummary from "src/services/toggl/getTimeSummary.js";

function sumUser(user: TogglTimeSummaryGroup, me: TogglMe) {
  const entries = user?.sub_groups ?? [];
  const sum: number = entries.reduce((acc, entry) => {
    const entrySum = entry.rates.reduce<number>((acc, rate) => {
      const hours = rate.billable_seconds / 3600;
      const dollarRate = rate.hourly_rate_in_cents / 100;
      return acc + hours * dollarRate;
    }, 0);
    return acc + entrySum;
  }, 0);

  const multiplier = user.id === me.id ? 1 : 0.3;

  return sum * multiplier;
}

async function doUpdate(date: Date, me: TogglMe) {
  const daystamp = date.toISOString().split("T")[0];

  const summary = await getTimeSummary({
    workspaceId: me.default_workspace_id,
    startDate: date,
    endDate: date,
    billable: true,
    grouping: "users",
  });

  const sum: number = summary.groups.reduce((acc, user) => {
    return acc + sumUser(user, me);
  }, 0);

  await createDatapoint("narthur", "gross", {
    value: sum,
    daystamp,
    requestid: daystamp,
  });
}

export async function update() {
  const dates = getWeekDates();
  const me = await getMe();

  await Promise.all(dates.map((d) => doUpdate(d, me)));
}
