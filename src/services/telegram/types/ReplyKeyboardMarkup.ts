import { type KeyboardButton } from "./KeyboardButton.js";

export type ReplyKeyboardMarkup = {
  // Array of button rows, each represented by an Array of KeyboardButton objects
  keyboard: Array<Array<KeyboardButton>>;

  // Requests clients to always show the keyboard when the regular keyboard is hidden
  // Defaults to false, in which case the custom keyboard can be hidden and opened with a keyboard icon
  is_persistent?: boolean;

  // Requests clients to resize the keyboard vertically for optimal fit
  // Defaults to false, in which case the custom keyboard is always of the same height as the app's standard keyboard
  resize_keyboard?: boolean;

  // Requests clients to hide the keyboard as soon as it's been used
  // The keyboard will still be available, but clients will automatically display the usual letter-keyboard in the chat
  // The user can press a special button in the input field to see the custom keyboard again
  // Defaults to false
  one_time_keyboard?: boolean;

  // The placeholder to be shown in the input field when the keyboard is active; 1-64 characters
  input_field_placeholder?: string;

  // Use this parameter if you want to show the keyboard to specific users only
  // Targets:
  // 1) users that are @mentioned in the text of the Message object
  // 2) if the bot's message is a reply (has reply_to_message_id), sender of the original message
  selective?: boolean;
};
