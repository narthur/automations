import {
  TogglProject,
  TogglProjectBillable,
  TogglProjectFixedFee,
  TogglProjectHourly,
} from "../types/toggl";

export const isBillable = (p: TogglProject): p is TogglProjectBillable =>
  !!p.billable && p.active;

export const isFixedFee = (p: TogglProject): p is TogglProjectFixedFee =>
  isBillable(p) &&
  !!p.fixed_fee &&
  !!p.estimated_hours &&
  p.estimated_hours > 0;

export const isHourly = (p: TogglProject): p is TogglProjectHourly =>
  isBillable(p) && !p.fixed_fee;
