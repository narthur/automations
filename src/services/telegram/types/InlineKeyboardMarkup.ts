import { InlineKeyboardButton } from "./InlineKeyboardButton.js";

export type InlineKeyboardMarkup = {
  inline_keyboard: Array<Array<InlineKeyboardButton>>; // Array of button rows, each represented by an Array of InlineKeyboardButton objects
};
