import { TimeEntry } from "./types";

export function getSumOfHours({
  entries,
  where = () => true,
}: {
  entries: TimeEntry[];
  where?: (e: TimeEntry) => boolean;
}): number {
  if (entries === undefined) return 0;

  const durations = entries
    .filter(where)
    .map((e) => e.duration)
    .filter((d) => d > 0);
  const sum = durations.reduce((a, b) => a + b, 0);

  return sum / 3600;
}
