import {
  getClients,
  getProjects,
  getTimeEntries,
} from "../services/toggl/index.js";
import dateParams from "../services/toggl/dateParams.js";
import { getSumOfHours } from "../services/toggl/getSumOfHours.js";
import { type TimeEntry } from "src/services/toggl/types.js";
import { makeUpdater } from "src/goals/index.js";

async function getPrimeEntries(date: Date): Promise<TimeEntry[]> {
  const entries = await getTimeEntries({
    params: dateParams(date),
  });

  return entries.filter((e) => e.tags.includes("prime"));
}

async function getPrimeTime(date: Date): Promise<number> {
  return getPrimeEntries(date).then((e) => getSumOfHours({ entries: e }));
}

async function getPrimeClients(date: Date): Promise<string[]> {
  const entries = await getPrimeEntries(date);

  if (!entries.length) return [];

  const projectIds = [...new Set(entries.map((e) => e.project_id))];
  const projects = await getProjects();
  const primeProjects = projects.filter((p) => projectIds.includes(p.id));
  const clientIds = [...new Set(primeProjects.map((p) => p.client_id))];
  const workspaceId = entries[0].workspace_id;
  const clients = await getClients(workspaceId);

  return clients.filter((c) => clientIds.includes(c.id)).map((c) => c.name);
}

async function updatePoint(d: Date) {
  const daystamp = d.toISOString().split("T")[0];
  const clientNames = await getPrimeClients(d);
  const primeHours = await getPrimeTime(d);

  return {
    value: primeHours * -2,
    daystamp,
    requestid: daystamp,
    comment: clientNames.join(", "),
  };
}

export default makeUpdater({
  user: "narthur",
  goal: "techtainment",
  getSharedData: () => Promise.resolve({}),
  getDateUpdate: updatePoint,
});
