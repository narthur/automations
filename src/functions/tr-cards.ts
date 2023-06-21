import * as functions from "firebase-functions";
import trCards from "../jobs/tr-cards";
import { bmAuths, notionApiKey, notionDatabaseIdTrCards } from "../secrets";
import setCors from "../helpers/setCors";

const secrets = [bmAuths.name, notionApiKey.name, notionDatabaseIdTrCards.name];

export const trCards_cron = functions
  .runWith({
    secrets,
  })
  .pubsub.schedule("every 30 minutes")
  .onRun(trCards);

export const trCards_https = functions
  .runWith({
    secrets,
  })
  .https.onRequest(async (req, res) => {
    setCors(res);
    await trCards();
  });
