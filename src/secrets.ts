import { defineSecret } from "firebase-functions/params";

// Beeminder
export const bmAuths = defineSecret("BM_AUTHS");

// Mailgun
export const mailgunApiKey = defineSecret("MAILGUN_API_KEY");
export const mailgunDomain = defineSecret("MAILGUN_DOMAIN");

// Toggl
export const togglApiToken = defineSecret("TOGGL_API_TOKEN");
export const togglClientAv = defineSecret("TOGGL_CLIENT_AV");

// Notion
export const notionApiKey = defineSecret("NOTION_API_KEY");
export const notionDatabaseIdTrCards = defineSecret(
  "NOTION_DATABASE_ID_TR_CARDS"
);

// Twilio
export const twilioAccountSid = defineSecret("TWILIO_ACCOUNT_SID");
export const twilioAuthToken = defineSecret("TWILIO_AUTH_TOKEN");
export const twilioPhoneNumber = defineSecret("TWILIO_PHONE_NUMBER");
export const twilioWhitelistedNumbers = defineSecret(
  "TWILIO_WHITELISTED_NUMBERS"
);

// OpenAI
export const openAiSecretKey = defineSecret("OPENAI_SECRET_KEY");
