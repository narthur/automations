import * as functions from "firebase-functions";
import { getClients, getProjects, getTimeEntries } from "../services/toggl";
import { sendEmail } from "../services/mailgun";
import { addMonths, endOfMonth, set } from "date-fns";
import { formatInTimeZone, utcToZonedTime } from "date-fns-tz";
import { allMailgun, allToggl } from "../secrets";
import getClientEntries from "../services/toggl/getClientEntries";
import { TimeEntry } from "../services/toggl/types";
import { getSumOfHours } from "../services/toggl/getSumOfHours";
import uniq from "../transforms/uniq";
import getEntriesRate from "../services/toggl/getEntriesRate";

const TIME_ZONE = "America/New_York";

const template = (p: {
  hours: number;
  rate: number;
  lines: string[];
  client: string;
  id: string;
  start_date: string;
  end_date: string;
}) => `
Key | Value
--- | ---
Invoice ID | ${p.id}
Period | ${p.start_date} - ${p.end_date}
Client | ${p.client}
Contractor | Nathan Arthur

Description | Hours
--- | ---
${p.lines.join("\n")}

Key | Value
--- | ---
Total Time | ${p.hours} hours
${p.rate && `Hourly Rate | $${p.rate.toFixed(2)}/hr`}
Total Due | $${(p.hours * p.rate).toFixed(2)}
`;

const line = ({ desc, entries }: { desc: string; entries: TimeEntry[] }) =>
  `${desc} | ${getSumOfHours({
    entries,
    where: (e) => e.description === desc,
  })}`;

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
    const entries = await getTimeEntries({ params });
    const workspaceId = entries[0].wid;
    const projects = await getProjects();
    const clients = await getClients(workspaceId);
    const monthName = formatInTimeZone(start, TIME_ZONE, "MMMM");

    await Promise.all(
      clients.map(async (c) => {
        const e = getClientEntries(c.id, entries, projects);
        const id = `${c.name}-${start.getFullYear()}-${start.getMonth() + 1}`;
        const rate = getEntriesRate({ timeEntries: e, projects });

        await sendEmail({
          subject: `${monthName} Invoice: ${c.name}`,
          markdown: template({
            ...params,
            hours: getSumOfHours({ entries: e }),
            rate,
            lines: uniq(e.map((e) => e.description)).map((desc) =>
              line({ desc, entries: e })
            ),
            client: c.name,
            id,
          }),
        });
      })
    );
  });
