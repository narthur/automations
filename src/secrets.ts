import d from "./effects/defineSecret.js";

// Beeminder
export const bmAuths = d("BM_AUTHS");

// Mailgun
export const mailgunApiKey = d("MAILGUN_API_KEY");
export const mailgunDomain = d("MAILGUN_DOMAIN");

// Toggl
export const togglApiToken = d("TOGGL_API_TOKEN");
export const togglClientAv = d("TOGGL_CLIENT_AV");
export const togglSigningSecret = d("TOGGL_SIGNING_SECRET");

// Notion
export const notionApiKey = d("NOTION_API_KEY");
export const notionDatabaseIdTrCards = d("NOTION_DATABASE_ID_TR_CARDS");
export const notionDatabaseIdTodos = d("NOTION_DATABASE_ID_TODOS");

// OpenAI
export const openAiSecretKey = d("OPENAI_SECRET_KEY");
export const openAiPrompt = d("OPENAI_PROMPT");

// Telegram
export const telegramApiToken = d("TELEGRAM_API_TOKEN");
export const telegramWebhookToken = d("TELEGRAM_WEBHOOK_TOKEN");
export const telegramAllowedUser = d("TELEGRAM_ALLOWED_USER");
export const telegramChatId = d("TELEGRAM_CHAT_ID");

// TaskRatchet
export const taskratchetUserId = d("TASKRATCHET_USER_ID");
export const taskratchetApiToken = d("TASKRATCHET_API_TOKEN");

// Sentry
export const sentryDsn = d("SENTRY_DSN");
