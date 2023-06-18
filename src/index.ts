import * as functions from "firebase-functions";
import gross_ from "./jobs/gross";
import { bmAuths, togglApiToken } from "./secrets";
import { twiml } from "twilio";

const gross_cron = functions
  .runWith({
    secrets: [bmAuths.name, togglApiToken.name],
  })
  .pubsub.schedule("every 30 minutes")
  .onRun(gross_);

const gross_https = functions
  .runWith({
    secrets: [bmAuths.name, togglApiToken.name],
  })
  .https.onRequest(async (req, res) => {
    res.set("Access-Control-Allow-Origin", "*");
    await gross_();
    res.send("OK");
  });

const sms_https = functions.https.onRequest((req, res) => {
  console.log(req.body);
  const m = new twiml.MessagingResponse();
  m.message("Hello World");
  res.send(m.toString());
});

export { gross_cron, gross_https, sms_https };
