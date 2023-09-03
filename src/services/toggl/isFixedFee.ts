import { isBillable } from "./isBillable.js";
import { TogglProject, TogglProjectFixedFee } from "./types.js";

export const isFixedFee = (p: TogglProject): p is TogglProjectFixedFee =>
  isBillable(p) &&
  !!p.fixed_fee &&
  !!p.estimated_hours &&
  p.estimated_hours > 0;
