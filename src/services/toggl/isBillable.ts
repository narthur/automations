import { type TogglProject, type TogglProjectBillable } from "./types.js";

export const isBillable = (p: TogglProject): p is TogglProjectBillable =>
  !!p.billable && p.active;
