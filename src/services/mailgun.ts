import { mailgunApiKey, mailgunDomain } from "../secrets";
import FormData from "form-data";
import Mailgun from "mailgun.js";
import memoize from "../effects/memoize";

const getMailgun = memoize(() => {
  const mailgun = new Mailgun(FormData);
  return mailgun.client({
    username: "api",
    key: mailgunApiKey.value(),
  });
}, "mailgun");

export async function sendEmail({
  recipients = ["nathan@nathanarthur.com"],
  body,
  from = "nathan@nathanarthur.com",
  subject,
}: {
  recipients?: string[];
  body: string;
  subject: string;
  from?: string;
}): Promise<unknown> {
  console.info("Sending email", { recipients, subject });
  return getMailgun().messages.create(mailgunDomain.value(), {
    from: `Nathan Arthur <${from}>`,
    to: recipients,
    subject,
    text: body,
  });
}
