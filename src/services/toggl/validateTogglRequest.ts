import crypto from "crypto";
import { TOGGL_SIGNING_SECRET } from "src/secrets.js";

// https://developers.track.toggl.com/docs/webhooks_start/validating_received_events
export default function validateTogglRequest(req: Request) {
  const message = JSON.stringify(req.body);
  const signature = req.headers.get("x-webhook-signature-256") || "";
  const secret = TOGGL_SIGNING_SECRET.value();
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
