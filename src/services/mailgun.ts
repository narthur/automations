import axios from "axios";
import { mailgunApiKey, mailgunDomain } from "../secrets";

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
  return axios.post(
    `https://api.mailgun.net/v3/${mailgunDomain.value()}/messages`,
    {
      from: `Nathan Arthur <${from}>`,
      to: recipients,
      subject,
      text: body,
    },
    {
      auth: {
        username: "api",
        password: mailgunApiKey.value(),
      },
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
