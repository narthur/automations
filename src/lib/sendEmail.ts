import axios from "axios";
import { defineSecret } from "firebase-functions/params";

const mailgunDomain = defineSecret("MAILGUN_DOMAIN");
const mailgunApiKey = defineSecret("MAILGUN_API_KEY");

export default async function sendEmail({
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
    }
  );
}
