import sendEmail from "./lib/sendEmail";

export default async function payroll(): Promise<string> {
  sendEmail(process.env.PAYROLL_RECIPIENTS);

  return Promise.resolve("Hello World");
}
