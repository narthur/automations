import uniq from "../../lib/uniq.js";
import { type TimeEntry, type TogglProject } from "./types.js";

export default function getEntriesRate({
  timeEntries,
  projects,
}: {
  timeEntries: TimeEntry[];
  projects: TogglProject[];
}): number {
  const rates = uniq(
    timeEntries.map((e) => projects.find((p) => p.id === e.project_id)?.rate)
  );

  if (timeEntries.length && rates.length !== 1) {
    throw new Error(`Expected one rate, found ${rates.length}`);
  }

  return rates[0] ?? 0;
}
