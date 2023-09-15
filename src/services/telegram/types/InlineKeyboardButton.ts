import { CallbackGame } from "./CallbackGame.js";
import { LoginUrl } from "./LoginUrl.js";
import { SwitchInlineQueryChosenChat } from "./SwitchInlineQueryChosenChat.js";
import { WebAppInfo } from "./WebAppInfo.js";

export type InlineKeyboardButton = {
  text: string; // Label text on the button
  url?: string; // Optional. HTTP or tg:// URL to be opened when the button is pressed
  callback_data?: string; // Optional. Data to be sent in a callback query to the bot when button is pressed, 1-64 bytes
  web_app?: WebAppInfo; // Optional. Description of the Web App that will be launched when the user presses the button
  login_url?: LoginUrl; // Optional. An HTTPS URL used to automatically authorize the user
  switch_inline_query?: string; // Optional. Prompt the user to select one of their chats, open that chat and insert the bot's username and the specified inline query in the input field
  switch_inline_query_current_chat?: string; // Optional. Insert the bot's username and the specified inline query in the current chat's input field
  switch_inline_query_chosen_chat?: SwitchInlineQueryChosenChat; // Optional. Prompt the user to select one of their chats of the specified type, open that chat and insert the bot's username and the specified inline query in the input field
  callback_game?: CallbackGame; // Optional. Description of the game that will be launched when the user presses the button
  pay?: boolean; // Optional. Specify True, to send a Pay button
};
