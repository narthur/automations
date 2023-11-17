import crypto from "crypto";
import env from "src/lib/env.js";

// https://developers.track.toggl.com/docs/webhooks_start/validating_received_events
export default function validateSignature(message: string, signature: string) {
  const secret = env("TOGGL_SIGNING_SECRET");

  if (!secret) {
    throw new Error("TOGGL_SIGNING_SECRET not set");
  }

  const hmac = crypto.createHmac("sha256", secret).setEncoding("hex");

  hmac.update(message);

  if (signature.replace(/^.*=/, "") == hmac.digest("hex")) {
    console.log("Valid HMAC");
    return true;
  } else {
    console.log("Invalid HMAC");
    return false;
  }
}
