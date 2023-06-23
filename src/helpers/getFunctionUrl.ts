import * as functions from "firebase-functions";

export default function getFunctionUrl(
  req: functions.https.Request,
  functionName?: string
) {
  return `https://${String(req.header("host"))}/${String(
    functionName ?? process.env.FUNCTION_TARGET
  )}`;
}
