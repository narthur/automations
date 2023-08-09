import * as functions from "firebase-functions";
import { bmAuths, togglApiToken, togglClientAv } from "../secrets";
import avPrime from "../jobs/av-prime";
import setCors from "../effects/setCors";

const secrets = [bmAuths.name, togglApiToken.name, togglClientAv.name];

export const avPrime_cron = functions
  .runWith({
    secrets,
  })
  .pubsub.schedule("every 30 minutes")
  .onRun(avPrime);

export const avPrime_https = functions
  .runWith({
    secrets,
  })
  .https.onRequest(async (req, res) => {
    setCors(res);
    await avPrime();
  });
