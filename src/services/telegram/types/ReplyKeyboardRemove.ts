export type ReplyKeyboardRemove = {
  remove_keyboard: true; // Requests clients to remove the custom keyboard
  selective?: boolean; // Optional. Use this parameter to remove the keyboard for specific users only. Defaults to false.
};
