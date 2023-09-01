// import axios, { AxiosError } from "axios";
import { mailgunApiKey, mailgunDomain } from "../secrets";

import FormData from "form-data";
import Mailgun from "mailgun.js";

const mailgun = new Mailgun(FormData);
const mg = mailgun.client({
  username: "api",
  key: mailgunApiKey.value(),
});

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
  return mg.messages.create(mailgunDomain.value(), {
    from: `Nathan Arthur <${from}>`,
    to: recipients,
    subject,
    text: body,
  });
}

// export async function sendEmail({
//   recipients = ["nathan@nathanarthur.com"],
//   body,
//   from = "nathan@nathanarthur.com",
//   subject,
// }: {
//   recipients?: string[];
//   body: string;
//   subject: string;
//   from?: string;
// }): Promise<unknown> {
//   console.info("Sending email", { recipients, subject });
//   return axios
//     .post(
//       `https://api.mailgun.net/v3/${mailgunDomain.value()}/messages`,
//       {
//         from: `Nathan Arthur <${from}>`,
//         to: recipients,
//         subject,
//         text: body,
//       },
//       {
//         auth: {
//           username: "api",
//           password: mailgunApiKey.value(),
//         },
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     )
//     .catch((e) => {
//       console.error("Error sending email");
//       if (e instanceof AxiosError) {
//         console.error(e.toJSON());
//       }
//       if (e instanceof Error) {
//         console.error(e.message);
//         console.error(e.stack);
//       }
//       throw e;
//     });
// }
