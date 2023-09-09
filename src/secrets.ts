import defineSecret from "./effects/defineSecret.js";

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
export const notionDatabaseIdTodos = defineSecret("NOTION_DATABASE_ID_TODOS");

// OpenAI
export const openAiSecretKey = defineSecret("OPENAI_SECRET_KEY");
export const openAiPrompt = defineSecret("OPENAI_PROMPT");

// Telegram
export const telegramApiToken = defineSecret("TELEGRAM_API_TOKEN");
export const telegramWebhookToken = defineSecret("TELEGRAM_WEBHOOK_TOKEN");
export const telegramAllowedUser = defineSecret("TELEGRAM_ALLOWED_USER");
export const telegramChatId = defineSecret("TELEGRAM_CHAT_ID");

// TaskRatchet
export const taskratchetUserId = defineSecret("TASKRATCHET_USER_ID");
export const taskratchetApiToken = defineSecret("TASKRATCHET_API_TOKEN");

// Sentry
export const sentryDsn = defineSecret("SENTRY_DSN");
