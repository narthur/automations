import * as functions from "firebase-functions";
import { getClients, getProjects, getTimeEntries } from "../services/toggl";
import { sendEmail } from "../services/mailgun";
import {
  addMonths,
  addSeconds,
  endOfMonth,
  formatDuration,
  intervalToDuration,
  set,
} from "date-fns";
import { TimeEntry, TogglProject } from "../services/toggl/types";
import { formatInTimeZone, utcToZonedTime } from "date-fns-tz";
import { allMailgun, allToggl } from "../secrets";

const TIME_ZONE = "America/New_York";

function formatSeconds(seconds: number) {
  if (seconds === 0) return "0 hours";

  const a = new Date(0);
  const b = addSeconds(a, seconds);

  return formatDuration(intervalToDuration({ start: a, end: b }), {
    format: ["hours", "minutes"],
  });
}

const formatDollars = (cents: number) => `$${(cents / 100).toFixed(2)}`;

function getClientEntries(
  clientId: number,
  entries: TimeEntry[],
  projects: TogglProject[]
) {
  return entries.filter((e) => {
    const p = projects.find((p) => p.id === e.project_id);
    return e.billable && p?.client_id === clientId;
  });
}

export const invoice_cron = functions
  .runWith({
    secrets: [...allMailgun, ...allToggl],
  })
  .pubsub.schedule("5 4 1 * *")
  .onRun(async () => {
    const utc = new Date(new Date().toUTCString());
    const zoned = utcToZonedTime(utc, TIME_ZONE);
    const start = set(addMonths(zoned, -1), {
      date: 1,
      hours: 0,
      minutes: 0,
      seconds: 0,
      milliseconds: 0,
    });
    const end = endOfMonth(start);
    const params = {
      start_date: formatInTimeZone(start, TIME_ZONE, "yyyy-MM-dd"),
      end_date: formatInTimeZone(end, TIME_ZONE, "yyyy-MM-dd"),
    };
    const entries = await getTimeEntries({
      params,
    });
    const workspaceId = entries[0].wid;
    const projects = await getProjects();
    const clients = await getClients(workspaceId);
    const monthName = formatInTimeZone(start, TIME_ZONE, "MMMM");

    await Promise.all(
      clients.map(async (c) => {
        const e = getClientEntries(c.id, entries, projects);
        const sumSeconds = e.reduce((a, b) => a + b.duration, 0);
        const formatted = formatSeconds(sumSeconds);
        const descriptions = [...new Set(e.map((e) => e.description))];
        const lines = descriptions.map((d) => {
          const dEntries = e.filter((e) => e.description === d);
          const dSumSeconds = dEntries.reduce((a, b) => a + b.duration, 0);
          const dFormatted = formatSeconds(dSumSeconds);
          return `${d} - ${dFormatted}`;
        });
        const id = `${c.name}-${start.getFullYear()}-${start.getMonth() + 1}`;
        const rates = [
          ...new Set(
            e.map((e) => projects.find((p) => p.id === e.project_id)?.rate)
          ),
        ];

        if (e.length && rates.length !== 1) {
          throw new Error(`Expected one rate, found ${rates.length}`);
        }

        const rate = rates[0] ?? 0;
        const rateLine =
          rate > 0 ? `\nHourly Rate: ${formatDollars(rate)}/hr` : "";
        const dueCents = (sumSeconds / 3600) * rate;
        const dueLine = `\nTotal Due: ${formatDollars(dueCents)}`;

        await sendEmail({
          subject: `${monthName} Invoice: ${c.name}`,
          body: `Invoice ID: ${id}\nPeriod: ${params.start_date} - ${
            params.end_date
          }\nClient: ${c.name}\nContractor: Nathan Arthur\n\n${lines.join(
            "\n"
          )}\n\nTotal Time: ${formatted}${rateLine}${dueLine}`,
        });
      })
    );
  });
