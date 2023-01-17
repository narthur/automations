import { TimeEntry } from "../types/toggl";

export default function getSumOfHours(entries: TimeEntry[]): number {
  if (entries === undefined) {
    return 0;
  }

  return entries.reduce((sum: number, entry: TimeEntry) => {
    if (entry.duration > 0) {
      return sum + entry.duration / 3600;
    }

    const start = new Date(entry.start);
    const end = new Date();
    const duration = end.getTime() - start.getTime();

    return (sum + duration) / 3600 / 1000;
  }, 0);
}
