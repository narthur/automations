import { isBillable } from "./isBillable";
import { TogglProject, TogglProjectFixedFee } from "./types";

export const isFixedFee = (p: TogglProject): p is TogglProjectFixedFee =>
  isBillable(p) &&
  !!p.fixed_fee &&
  !!p.estimated_hours &&
  p.estimated_hours > 0;
