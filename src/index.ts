import * as functions from "firebase-functions";
import gross_ from "./jobs/gross";
import { bmAuths, togglApiToken } from "./secrets";

const gross = functions
  .runWith({
    secrets: [bmAuths.name, togglApiToken.name],
  })
  .https.onRequest(async (req, res) => {
    if (req.params.validation_code) {
      // https://developers.track.toggl.com/docs/webhooks_start/url_endpoint_validation/index.html
      res.send({
        validation_code: req.params.validation_code,
      });
    }
    await gross_();
    res.send("job completed: gross");
  });

export { gross };
