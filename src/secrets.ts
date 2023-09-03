import defineSecret from "./effects/defineSecret.js";

// Beeminder
export const bmAuths = defineSecret("BM_AUTHS");
export const allBm = [bmAuths.name];

// Mailgun
export const mailgunApiKey = defineSecret("MAILGUN_API_KEY");
export const mailgunDomain = defineSecret("MAILGUN_DOMAIN");
export const allMailgun = [mailgunApiKey.name, mailgunDomain.name];

// Toggl
export const togglApiToken = defineSecret("TOGGL_API_TOKEN");
export const togglClientAv = defineSecret("TOGGL_CLIENT_AV");
export const allToggl = [togglApiToken.name, togglClientAv.name];

// Notion
export const notionApiKey = defineSecret("NOTION_API_KEY");
export const notionDatabaseIdTrCards = defineSecret(
  "NOTION_DATABASE_ID_TR_CARDS"
);
export const notionDatabaseIdTodos = defineSecret("NOTION_DATABASE_ID_TODOS");
export const allNotion = [
  notionApiKey.name,
  notionDatabaseIdTrCards.name,
  notionDatabaseIdTodos.name,
];

// OpenAI
export const openAiSecretKey = defineSecret("OPENAI_SECRET_KEY");
export const openAiPrompt = defineSecret("OPENAI_PROMPT");
export const allOpenAi = [openAiSecretKey.name, openAiPrompt.name];

// Telegram
export const telegramApiToken = defineSecret("TELEGRAM_API_TOKEN");
export const telegramWebhookToken = defineSecret("TELEGRAM_WEBHOOK_TOKEN");
export const telegramAllowedUser = defineSecret("TELEGRAM_ALLOWED_USER");
export const telegramChatId = defineSecret("TELEGRAM_CHAT_ID");
export const allTelegram = [
  telegramApiToken.name,
  telegramWebhookToken.name,
  telegramAllowedUser.name,
  telegramChatId.name,
];

// TaskRatchet
export const taskratchetUserId = defineSecret("TASKRATCHET_USER_ID");
export const taskratchetApiToken = defineSecret("TASKRATCHET_API_TOKEN");
export const allTaskratchet = [
  taskratchetUserId.name,
  taskratchetApiToken.name,
];
