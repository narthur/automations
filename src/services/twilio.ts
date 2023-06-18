import twilio from "twilio";
import * as functions from "firebase-functions";
import { twilioAuthToken, twilioWhitelistedNumbers } from "../secrets";

export function isRequestAuthorized(req: functions.https.Request): boolean {
  const twilioSignature = String(req.headers["x-twilio-signature"]);
  const url = `https://${String(req.header("host"))}/${String(
    process.env.FUNCTION_TARGET
  )}`;
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
