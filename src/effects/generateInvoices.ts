import {
  getClients,
  getProjects,
  getTimeEntries,
} from "../services/toggl/index.js";
import { sendEmail } from "../services/mailgun.js";
import { addMonths, endOfMonth, format, startOfMonth } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";
import getClientEntries from "../services/toggl/getClientEntries.js";
import { TimeEntry } from "../services/toggl/types.js";
import { getSumOfHours } from "../services/toggl/getSumOfHours.js";
import uniq from "../transforms/uniq.js";
import getEntriesRate from "../services/toggl/getEntriesRate.js";

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
### Invoice

Key | Value
--- | ---
Invoice ID | ${p.id}
Period | ${p.start_date} - ${p.end_date}
Client | ${p.client}
Contractor | Nathan Arthur

### Line Items

Hours | Description
--- | ---
${p.lines.join("\n")}

### Summary

Key | Value
--- | ---
Total Time | ${p.hours.toFixed(2)} hours
Hourly Rate | ${p.rate ? `$${p.rate.toFixed(2)}/hr` : "n/a"}
Total Due | $${(p.hours * p.rate).toFixed(2)}
`;

const line = ({ desc, entries }: { desc: string; entries: TimeEntry[] }) =>
  `${getSumOfHours({
    entries,
    where: (e) => e.description === desc,
  }).toFixed(2)} | ${desc}`;

export default async function generateInvoices() {
  const utc = new Date(new Date().toUTCString());
  const zoned = utcToZonedTime(utc, TIME_ZONE);
  const start = startOfMonth(addMonths(zoned, -1));
  const end = endOfMonth(start);
  const params = {
    start_date: format(start, "yyyy-MM-dd"),
    end_date: format(end, "yyyy-MM-dd"),
  };
  const entries = await getTimeEntries({ params });
  const workspaceId = entries[0]?.workspace_id;
  const projects = await getProjects();
  const clients = await getClients(workspaceId);

  await Promise.all(
    clients.map(async (c) => {
      const e = getClientEntries(c.id, entries, projects);
      const id = `${c.name}-${start.getFullYear()}-${start.getMonth() + 1}`;
      const rate = getEntriesRate({ timeEntries: e, projects });

      await sendEmail({
        subject: `${c.name}: Invoice for ${format(start, "MMMM yyyy")}`,
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
}