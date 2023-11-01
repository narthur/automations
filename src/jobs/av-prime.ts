import {
  getClients,
  getProjects,
  getTimeEntries,
} from "../services/toggl/index.js";
import { TOGGL_CLIENT_AV } from "../secrets.js";
import dateParams from "../services/toggl/dateParams.js";
import getWeekDates from "../lib/getWeekDates.js";
import { getSumOfHours } from "../services/toggl/getSumOfHours.js";
import { type TimeEntry } from "src/services/toggl/types.js";
import createDatapoint from "src/services/beeminder/createDatapoint.js";

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
  const hasPrimeMatch = clientNames.includes(TOGGL_CLIENT_AV.value());

  await createDatapoint("narthur", "audioprime", {
    value: hasPrimeMatch ? 1 : 0,
    daystamp,
    requestid: daystamp,
    comment: clientNames.join(", "),
  });

  const primeHours = await getPrimeTime(d);

  await createDatapoint("narthur", "techtainment", {
    value: primeHours * -2,
    daystamp,
    requestid: daystamp,
    comment: clientNames.join(", "),
  });
}

export default async function avPrime() {
  return Promise.all(getWeekDates().map(updatePoint));
}
