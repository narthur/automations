import { TimeEntry } from "./types";

export function getSumOfHours(entries: TimeEntry[]): number {
  if (entries === undefined) return 0;

  const durations = entries.map((e) => e.duration).filter((d) => d > 0);
  const sum = durations.reduce((a, b) => a + b, 0);

  return sum / 3600;
}
