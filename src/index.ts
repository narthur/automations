import * as functions from "firebase-functions";
import gross_ from "./jobs/gross";
import { bmAuths, togglApiToken } from "./secrets";

const gross = functions
  .runWith({
    secrets: [bmAuths.name, togglApiToken.name],
  })
  .https.onRequest(async (req, res) => {
    await gross_();
    res.send("job completed: gross");
  });

export { gross };
