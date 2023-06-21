import * as functions from "firebase-functions";
import gross from "../jobs/gross";
import { bmAuths, togglApiToken } from "../secrets";
import setCors from "../helpers/setCors";

const secrets = [bmAuths.name, togglApiToken.name];

export const gross_cron = functions
  .runWith({
    secrets,
  })
  .pubsub.schedule("every 30 minutes")
  .onRun(gross);

export const gross_https = functions
  .runWith({
    secrets,
  })
  .https.onRequest(async (req, res) => {
    setCors(res);
    await gross();
  });
