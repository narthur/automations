import sendEmail from "./lib/sendEmail";
import getSum from "./lib/toggl/getSum";
import getTimeEntries from "./lib/toggl/getTimeEntries";

function getFirstDayOfPreviousMonth() {
  const date = new Date();
  date.setDate(0);
  date.setDate(1);
  return date;
}

export default async function payroll(): Promise<string> {
  const entries = await getTimeEntries({
    filters: {
      projectIds: process.env.PAYROLL_TOGGL_PROJECTS.split(",").map(Number),
    },
  });
  const sum = getSum(entries);
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
