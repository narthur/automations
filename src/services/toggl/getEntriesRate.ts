import type { TimeEntry } from "src/__generated__/graphql.js";

import uniq from "../../lib/uniq.js";
import { type TogglProject } from "./types.js";

export default function getEntriesRate({
  timeEntries,
  projects,
}: {
  timeEntries: TimeEntry[];
  projects: TogglProject[];
}): number {
  const rates = uniq(
    timeEntries.map((e) => projects.find((p) => p.id === e.projectId)?.rate)
  );

  if (timeEntries.length && rates.length !== 1) {
    throw new Error(`Expected one rate, found ${rates.length}`);
  }

  return rates[0] ?? 0;
}
