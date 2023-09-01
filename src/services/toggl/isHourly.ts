import { isBillable } from "./isBillable";
import { TogglProject, TogglProjectHourly } from "./types";

export const isHourly = (p: TogglProject): p is TogglProjectHourly =>
  isBillable(p) && !p.fixed_fee;
