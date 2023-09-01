import * as functions from "firebase-functions";

export function validateTogglEndpoint(
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
