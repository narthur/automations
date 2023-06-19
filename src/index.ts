import * as functions from "firebase-functions";
import gross from "./jobs/gross";
import trCards from "./jobs/tr-cards";
import {
  bmAuths,
  togglApiToken,
  notionApiKey,
  notionDatabaseIdTrCards,
  twilioAuthToken,
  twilioWhitelistedNumbers,
  openAiSecretKey,
} from "./secrets";
import twilio from "twilio";
import { isRequestAuthorized } from "./services/twilio";
import { getResponse } from "./services/openai";

const grossSecrets = [bmAuths.name, togglApiToken.name];
const trCardsSecrets = [
  bmAuths.name,
  notionApiKey.name,
  notionDatabaseIdTrCards.name,
];
const smsSecrets = [
  twilioAuthToken.name,
  twilioWhitelistedNumbers.name,
  openAiSecretKey.name,
];

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
  .https.onRequest(async (req, res) => {
    console.info("Validating Twilio request");

    if (!isRequestAuthorized(req)) {
      console.error("Unauthorized");
      res.status(401).send("Unauthorized");
      return;
    }

    console.info("Twilio request is authorized");

    console.log(req.body);

    const params = req.body as Record<string, unknown>;
    const m = new twilio.twiml.MessagingResponse();
    const response = await getResponse(params.Body as string);

    m.message(JSON.stringify(response));

    console.info("Sending response");
    res.send(m.toString());
  });

export { gross_cron, gross_https, trCards_cron, trCards_https, sms_https };
