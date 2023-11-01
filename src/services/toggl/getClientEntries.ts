import { TimeEntry, TogglProject } from "./types.js";

export default function getClientEntries(
  clientId: number,
  entries: TimeEntry[],
  projects: TogglProject[]
): TimeEntry[] {
  return entries.filter((e) => {
    const p = projects.find((p) => p.id === e.project_id);
    return e.billable && p?.client_id === clientId;
  });
}
