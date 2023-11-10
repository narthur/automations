import crypto from "crypto";
import express from "express";
import { TOGGL_SIGNING_SECRET } from "src/secrets.js";

export default function validateTogglRequest(req: express.Request) {
  const message = JSON.stringify(req.body);
  const signature = req.header("x-webhook-signature-256") || "";
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
