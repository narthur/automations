import { TogglProject, TogglProjectBillable } from "./types";

export const isBillable = (p: TogglProject): p is TogglProjectBillable =>
  !!p.billable && p.active;
