export type KeyboardButtonRequestUser = {
  // Signed 32-bit identifier of the request, which will be received back in the UserShared object.
  // Must be unique within the message.
  request_id: number;

  // Optional. Pass True to request a bot, pass False to request a regular user.
  // If not specified, no additional restrictions are applied.
  user_is_bot?: boolean;

  // Optional. Pass True to request a premium user, pass False to request a non-premium user.
  // If not specified, no additional restrictions are applied.
  user_is_premium?: boolean;
};
