export type LoginUrl = {
  url: string; // An HTTPS URL to be opened with user authorization data added to the query string when the button is pressed
  forward_text?: string; // Optional. New text of the button in forwarded messages
  bot_username?: string; // Optional. Username of a bot, which will be used for user authorization

  // If not specified, the current bot's username will be assumed.
  // The url's domain must be the same as the domain linked with the bot.
  request_write_access?: boolean; // Optional. Pass True to request the permission for your bot to send messages to the user
};
