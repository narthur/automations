import { KeyboardButtonPollType } from "./KeyboardButtonPollType.js";
import { KeyboardButtonRequestChat } from "./KeyboardButtonRequestChat.js";
import { KeyboardButtonRequestUser } from "./KeyboardButtonRequestUser.js";
import { WebAppInfo } from "./WebAppInfo.js";

export type KeyboardButton = {
  // Text of the button. If none of the optional fields are used, it will be sent as a message when the button is pressed
  text: string;

  // If specified, pressing the button will open a list of suitable users.
  // Tapping on any user will send their identifier to the bot in a “user_shared” service message.
  // Available in private chats only.
  request_user?: KeyboardButtonRequestUser;

  // If specified, pressing the button will open a list of suitable chats.
  // Tapping on a chat will send its identifier to the bot in a “chat_shared” service message.
  // Available in private chats only.
  request_chat?: KeyboardButtonRequestChat;

  // If True, the user's phone number will be sent as a contact when the button is pressed.
  // Available in private chats only.
  request_contact?: boolean;

  // If True, the user's current location will be sent when the button is pressed.
  // Available in private chats only.
  request_location?: boolean;

  // If specified, the user will be asked to create a poll and send it to the bot when the button is pressed.
  // Available in private chats only.
  request_poll?: KeyboardButtonPollType;

  // If specified, the described Web App will be launched when the button is pressed.
  // The Web App will be able to send a “web_app_data” service message.
  // Available in private chats only.
  web_app?: WebAppInfo;
};
