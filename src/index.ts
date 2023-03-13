import * as functions from "firebase-functions";
import gross_ from "./jobs/gross";
import { bmAuths, togglApiToken } from "./secrets";
import { validateTogglEndpoint } from "./services/toggl.helpers";

const TIMEOUT = 10000;

function timeout(promise: Promise<unknown>, ms: number) {
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(`Timed out in ${ms}ms.`), ms);
  });

  return Promise.race([promise, timeoutPromise]);
}

const gross = functions
  .runWith({
    secrets: [bmAuths.name, togglApiToken.name],
  })
  .https.onRequest(async (req, res) => {
    if (validateTogglEndpoint(req, res)) return;
    await timeout(gross_(), TIMEOUT).catch(console.error);
    res.send("job completed: gross");
  });

export { gross };
