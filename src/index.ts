import * as functions from "firebase-functions";
import gross from "./jobs/gross";
import trCards from "./jobs/tr-cards";
import {
  bmAuths,
  togglApiToken,
  notionApiKey,
  notionDatabaseIdTrCards,
  twilioAuthToken,
} from "./secrets";
import twilio from "twilio";

const grossSecrets = [bmAuths.name, togglApiToken.name];
const trCardsSecrets = [
  bmAuths.name,
  notionApiKey.name,
  notionDatabaseIdTrCards.name,
];
const smsSecrets = [twilioAuthToken.name];

function setCors(res: functions.Response) {
  res.set("Access-Control-Allow-Origin", "*");
}

const gross_cron = functions
  .runWith({
    secrets: grossSecrets,
  })
  .pubsub.schedule("every 30 minutes")
  .onRun(gross);

const gross_https = functions
  .runWith({
    secrets: grossSecrets,
  })
  .https.onRequest(async (req, res) => {
    setCors(res);
    await gross();
  });

const trCards_cron = functions
  .runWith({
    secrets: trCardsSecrets,
  })
  .pubsub.schedule("every 30 minutes")
  .onRun(trCards);

const trCards_https = functions
  .runWith({
    secrets: trCardsSecrets,
  })
  .https.onRequest(async (req, res) => {
    setCors(res);
    await trCards();
  });

const sms_https = functions
  .runWith({
    secrets: smsSecrets,
  })
  .https.onRequest((req, res) => {
    const twilioSignature = String(req.headers["X-Twilio-Signature"]);

    const isValid = twilio.validateRequest(
      twilioAuthToken.value(),
      twilioSignature,
      req.url,
      req.body as Record<string, unknown>
    );

    if (!isValid) {
      res.status(401).send("Unauthorized");
      return;
    }

    console.log(req.body);

    const m = new twilio.twiml.MessagingResponse();

    m.message("Hello World");

    res.send(m.toString());
  });

export { gross_cron, gross_https, trCards_cron, trCards_https, sms_https };
