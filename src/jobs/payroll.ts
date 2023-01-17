import sendEmail from "../lib/sendEmail";
import getSumOfHours from "../lib/getSumOfHours";
import { getTimeEntries } from "../lib/toggl";

function getFirstDayOfPreviousMonth() {
  const date = new Date();
  date.setDate(0);
  date.setDate(1);
  return date;
}

export default async function payroll(): Promise<string> {
  const projectIds = process.env.PAYROLL_TOGGL_PROJECTS.split(",").map(Number);
  const all = await getTimeEntries();
  const entries = all.filter((e) => projectIds.includes(e.project_id));
  const sum = getSumOfHours(entries);
  const body = `Total time: ${sum}`;
  const recipients = [
    ...process.env.PAYROLL_TOGGL_RECIPIENTS.split(","),
    ...process.env.PAYROLL_GLOBAL_RECIPIENTS.split(","),
  ];
  const date = getFirstDayOfPreviousMonth();
  const subject = `Invoice for month starting ${date.toLocaleDateString()}`;

  await sendEmail({
    recipients,
    subject,
    body,
  });

  return Promise.resolve("Hello World");
}

if (!process.env.VITEST_WORKER_ID) {
  console.log("running");
  void payroll();
  console.log("done");
}
