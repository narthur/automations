import type { TimeEntry } from "src/__generated__/graphql.js";

import { type TogglProject } from "./types.js";

export default function getClientEntries(
  clientId: number,
  entries: TimeEntry[],
  projects: TogglProject[]
): TimeEntry[] {
  return entries.filter((e) => {
    const p = projects.find((p) => p.id === e.projectId);
    return e.billable && p?.client_id === clientId;
  });
}
