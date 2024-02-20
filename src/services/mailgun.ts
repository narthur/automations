import FormData from "form-data";
import Mailgun, { type MessagesSendResult } from "mailgun.js";
import type { IMailgunClient } from "mailgun.js/Interfaces/index.js";
import { parse } from "marked";

import env from "../lib/env.js";

let client: IMailgunClient;

function getClient() {
  if (!client) {
    const key = env("MAILGUN_API_KEY");

    if (!key) {
      throw new Error("MAILGUN_API_KEY env var not set");
    }

    const mailgun = new Mailgun.default(FormData);

    client = mailgun.client({
      username: "api",
      key,
    });
  }

  return client;
}

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
}): Promise<MessagesSendResult> {
  console.info("Sending email", { recipients, subject });
  const domain = env("MAILGUN_DOMAIN");

  if (!domain) {
    throw new Error("MAILGUN_DOMAIN env var not set");
  }

  return getClient().messages.create(domain, {
    from: `Nathan Arthur <${from}>`,
    to: recipients,
    subject,
    text: markdown,
    html: await parse(markdown),
  });
}
