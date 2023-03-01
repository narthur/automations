import {
  TogglProject,
  TogglProjectBillable,
  TogglProjectFixedFee,
  TogglProjectHourly,
  TimeEntry,
} from "../services/toggl.types";
import * as functions from "firebase-functions";

export function getSumOfHours(entries: TimeEntry[]): number {
  if (entries === undefined) return 0;

  const durations = entries.map((e) => e.duration).filter((d) => d > 0);
  const sum = durations.reduce((a, b) => a + b, 0);

  return sum / 3600;
}

export const isBillable = (p: TogglProject): p is TogglProjectBillable =>
  !!p.billable && p.active;

export const isFixedFee = (p: TogglProject): p is TogglProjectFixedFee =>
  isBillable(p) &&
  !!p.fixed_fee &&
  !!p.estimated_hours &&
  p.estimated_hours > 0;

export const isHourly = (p: TogglProject): p is TogglProjectHourly =>
  isBillable(p) && !p.fixed_fee;

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
