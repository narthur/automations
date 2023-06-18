import { defineSecret } from "firebase-functions/params";

// Beeminder
export const bmAuths = defineSecret("BM_AUTHS");

// Mailgun
export const mailgunApiKey = defineSecret("MAILGUN_API_KEY");
export const mailgunDomain = defineSecret("MAILGUN_DOMAIN");

// Toggl
export const togglApiToken = defineSecret("TOGGL_API_TOKEN");

// Notion
export const notionApiKey = defineSecret("NOTION_API_KEY");
export const notionDatabaseIdTrCards = defineSecret(
  "NOTION_DATABASE_ID_TR_CARDS"
);

// Twilio
export const twilioAuthToken = defineSecret("TWILIO_AUTH_TOKEN");
