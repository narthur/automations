import sendEmail from "./lib/sendEmail";
import getSum from "./lib/toggl/getSum";
import getTimeEntries from "./lib/toggl/getTimeEntries";

export default async function payroll(): Promise<string> {
  const entries = await getTimeEntries();
  const sum = getSum(entries);
  const body = `Total time: ${sum}`;
  const recipients = process.env.PAYROLL_RECIPIENTS.split(",");

  sendEmail(recipients, body);

  return Promise.resolve("Hello World");
}
