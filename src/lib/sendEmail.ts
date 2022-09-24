import axios from "axios";

// Axios example:
//
// curl -s --user 'api:YOUR_API_KEY' \
//     https://api.mailgun.net/v3/YOUR_DOMAIN_NAME/messages \
//     -F from='Excited User <mailgun@YOUR_DOMAIN_NAME>' \
//     -F to=YOU@YOUR_DOMAIN_NAME \
//     -F to=bar@example.com \
//     -F subject='Hello' \
//     -F text='Testing some Mailgun awesomeness!'
//
// source: https://documentation.mailgun.com/en/latest/quickstart-sending.html#send-with-smtp-or-api

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
  // Send email via Mailgun API and Axios
  return axios.post(
    `https://api.mailgun.net/v3/${process.env.MAILGUN_DOMAIN}/messages`,
    {
      from: `Nathan Arthur <${from}>`,
      to: recipients,
      subject,
      text: body,
    },
    {
      auth: {
        username: "api",
        password: process.env.MAILGUN_API_KEY,
      },
    }
  );
}
