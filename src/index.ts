import * as functions from "firebase-functions";
import gross_ from "./jobs/gross";
import { bmAuths, togglApiToken } from "./secrets";

const gross_cron = functions
  .runWith({
    secrets: [bmAuths.name, togglApiToken.name],
  })
  .pubsub.schedule("every 10 minutes")
  .onRun(gross_);

const gross_https = functions
  .runWith({
    secrets: [bmAuths.name, togglApiToken.name],
  })
  .https.onRequest((req, res) => {
    res.set("Access-Control-Allow-Origin", "*");
    return gross_();
  });

export { gross_cron, gross_https };
