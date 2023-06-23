import twilio from "twilio";
import * as functions from "firebase-functions";
import {
  twilioAccountSid,
  twilioAuthToken,
  twilioPhoneNumber,
  twilioWhitelistedNumbers,
} from "../secrets";
import getFunctionUrl from "src/helpers/getFunctionUrl";

export function isRequestAuthorized(req: functions.https.Request): boolean {
  const twilioSignature = String(req.headers["x-twilio-signature"]);
  const url = getFunctionUrl(req);
  const params = req.body as Record<string, unknown>;
  const isValid = twilio.validateRequest(
    twilioAuthToken.value(),
    twilioSignature,
    url,
    params
  );
  const isWhitelisted =
    typeof params.From === "string" &&
    params.From.length > 0 &&
    twilioWhitelistedNumbers.value().includes(params.From);

  return isValid && isWhitelisted;
}

export function sendMessage(to: string, body: string) {
  const client = twilio(twilioAccountSid.value(), twilioAuthToken.value());

  return client.messages.create({
    body,
    from: twilioPhoneNumber.value(),
    to,
  });
}

export async function sendMessages(to: string, body: string[]) {
  for (const message of body) {
    await sendMessage(to, message);
  }
}
