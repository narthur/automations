import { isBillable } from "./isBillable.js";
import { type TogglProject, type TogglProjectHourly } from "./types.js";

export const isHourly = (p: TogglProject): p is TogglProjectHourly =>
  isBillable(p) && !p.fixed_fee;
