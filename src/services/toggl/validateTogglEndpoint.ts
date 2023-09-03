import express from "express";

export function validateTogglEndpoint(
  req: express.Request,
  res: express.Response
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
