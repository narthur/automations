import * as functions from "firebase-functions";
import gross_ from "./jobs/gross";
import { bmAuths, togglApiToken } from "./secrets";
import { validateTogglEndpoint } from "./services/toggl.helpers";

const gross = functions
  .runWith({
    secrets: [bmAuths.name, togglApiToken.name],
  })
  .https.onRequest(async (req, res) => {
    if (validateTogglEndpoint(req, res)) return;
    await gross_();
    res.send("job completed: gross");
  });

export { gross };
