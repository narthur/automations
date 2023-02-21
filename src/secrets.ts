import { defineSecret } from "firebase-functions/params";

export const bmAuths = defineSecret("BM_AUTHS");
export const mailgunApiKey = defineSecret("MAILGUN_API_KEY");
export const mailgunDomain = defineSecret("MAILGUN_DOMAIN");
export const togglApiToken = defineSecret("TOGGL_API_TOKEN");
