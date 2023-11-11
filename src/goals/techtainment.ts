import { makeUpdater } from "src/goals/index.js";
import makeDaystamp from "src/lib/makeDaystamp.js";
import { type TimeEntry, TogglProject } from "src/services/toggl/types.js";

import dateParams from "../services/toggl/dateParams.js";
import { getSumOfHours } from "../services/toggl/getSumOfHours.js";
import { getClients, getTimeEntries } from "../services/toggl/index.js";
import { getProjects } from "src/services/toggl/getProjects.js";

async function getPrimeEntries(date: Date): Promise<TimeEntry[]> {
  const entries = await getTimeEntries({
    params: dateParams(date),
  });

  return entries.filter((e) => e.tags.includes("prime"));
}

async function getPrimeClients({
  entries,
  projects,
}: {
  entries: TimeEntry[];
  projects: TogglProject[];
}): Promise<string[]> {
  if (!entries.length) return [];

  const projectIds = [...new Set(entries.map((e) => e.project_id))];
  const primeProjects = projects.filter((p) => projectIds.includes(p.id));
  const clientIds = [...new Set(primeProjects.map((p) => p.client_id))];
  const workspaceId = entries[0].workspace_id;
  const clients = await getClients(workspaceId);

  return clients.filter((c) => clientIds.includes(c.id)).map((c) => c.name);
}

async function updatePoint(
  d: Date,
  {
    projects,
  }: {
    projects: TogglProject[];
  }
) {
  const daystamp = makeDaystamp(d);
  const entries = await getPrimeEntries(d);
  const clientNames = await getPrimeClients({ entries, projects });
  const primeHours = getSumOfHours({ entries });

  return {
    value: primeHours * -2,
    daystamp,
    requestid: daystamp,
    comment: clientNames.join(", "),
  };
}

export const update = makeUpdater({
  user: "narthur",
  goal: "techtainment",
  getSharedData: async () => ({
    projects: await getProjects(),
  }),
  getDateUpdate: updatePoint,
});
