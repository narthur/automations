import { defineSecret } from "firebase-functions/params";

/*
After defining a new secret in `secrets.ts` and including it in the function's 
secrets array, you'll need to set it in the Firebase project:

pnpm secrets:set THE_SECRET_ID # and enter the value
pnpm secrets:get THE_SECRET_ID # to verify

You can view the secret's value in the Google Cloud console Secrets Manager.
*/

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

// Telegram
export const telegramApiToken = defineSecret("TELEGRAM_API_TOKEN");
export const telegramWebhookToken = defineSecret("TELEGRAM_WEBHOOK_TOKEN");
export const telegramAllowedUser = defineSecret("TELEGRAM_ALLOWED_USER");
