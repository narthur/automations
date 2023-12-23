import { addMonths, endOfMonth, format, startOfMonth } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";
import getBillingSummary from "src/services/toggl/getBillingSummary.js";

import { sendEmail } from "../services/mailgun.js";
import template from "./generateInvoices.template.js";

const TIME_ZONE = "America/New_York";

const line = ({ desc, hours }: { desc: string; hours: number }) =>
  `${hours.toFixed(2)} | ${desc.replaceAll("<", "&lt;")}`;

export default async function generateInvoices() {
  const utc = new Date(new Date().toUTCString());
  const zoned = utcToZonedTime(utc, TIME_ZONE);
  const start = startOfMonth(addMonths(zoned, -1));
  const end = endOfMonth(start);

  const clients = await getBillingSummary({
    startDate: start,
    endDate: end,
  });

  await Promise.all(
    clients.map(async (c) => {
      const id = `${c.clientName}-${start.getFullYear()}-${
        start.getMonth() + 1
      }`;

      await sendEmail({
        subject: `${c.clientName}: Invoice for ${format(start, "MMMM yyyy")}`,
        recipients: ["nathan@taskratchet.com"],
        markdown: template({
          start_date: format(start, "yyyy-MM-dd"),
          end_date: format(end, "yyyy-MM-dd"),
          hours: c.tasks.reduce((sum, t) => sum + t.billableHours, 0),
          rate: c.clientRate,
          lines: c.tasks.map((t) =>
            line({ desc: t.description, hours: t.billableHours })
          ),
          client: c.clientName,
          id,
        }),
      });
    })
  );
}
