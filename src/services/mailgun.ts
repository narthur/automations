import { MAILGUN_API_KEY, MAILGUN_DOMAIN } from "../secrets.js";
import FormData from "form-data";
import Mailgun from "mailgun.js";
import { parse } from "marked";

const mailgun = new Mailgun.default(FormData);
const client = mailgun.client({
  username: "api",
  key: MAILGUN_API_KEY.value(),
});

export async function sendEmail({
  recipients = ["nathan@nathanarthur.com"],
  markdown,
  from = "nathan@nathanarthur.com",
  subject,
}: {
  recipients?: string[];
  markdown: string;
  subject: string;
  from?: string;
}): Promise<unknown> {
  console.info("Sending email", { recipients, subject });
  return client.messages.create(MAILGUN_DOMAIN.value(), {
    from: `Nathan Arthur <${from}>`,
    to: recipients,
    subject,
    text: markdown,
    html: parse(markdown),
  });
}
