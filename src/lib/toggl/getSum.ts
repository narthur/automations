import { TimeEntry } from "./getTimeEntries";

export default function getSum(entries: TimeEntry[]): number {
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
