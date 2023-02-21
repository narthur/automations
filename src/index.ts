import * as functions from "firebase-functions";
import gross_ from "./jobs/gross";
import { bmAuths, togglApiToken } from "./secrets";

function validateTogglEndpoint(
  req: functions.https.Request,
  res: functions.Response
) {
  const body = req.body as Record<string, unknown>;
  const code = "validation_code" in body && body.validation_code;
  if (code) {
    // https://developers.track.toggl.com/docs/webhooks_start/url_endpoint_validation/index.html
    res.send({
      validation_code: code,
    });
    return true;
  }
  return false;
}

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
