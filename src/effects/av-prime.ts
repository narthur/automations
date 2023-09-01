import { createDatapoint } from "../services/beeminder";
import { getClients, getProjects, getTimeEntries } from "../services/toggl";
import { togglClientAv } from "../secrets";
import dateParams from "../services/toggl/dateParams";
import getWeekDates from "../effects/getWeekDates";
import memoize from "../effects/memoize";
import { getSumOfHours } from "src/services/toggl/getSumOfHours";

const _getTimeEntries = memoize(getTimeEntries, "getTimeEntries");
const _getProjects = memoize(getProjects, "getProjects");
const _getClients = memoize(getClients, "getClients");

async function getPrimeEntries(date: Date) {
  const entries = await _getTimeEntries({
    params: dateParams(date),
  });

  return entries.filter((e) => e.tags.includes("prime")) ?? [];
}

async function getPrimeTime(date: Date): Promise<number> {
  return getPrimeEntries(date).then(getSumOfHours);
}

async function getPrimeClients(date: Date): Promise<string[]> {
  const entries = await getPrimeEntries(date);

  if (!entries.length) return [];

  const projectIds = [...new Set(entries.map((e) => e.project_id))];
  const projects = await _getProjects();
  const primeProjects = projects.filter((p) => projectIds.includes(p.id));
  const clientIds = [...new Set(primeProjects.map((p) => p.client_id))];
  const workspaceId = entries[0].workspace_id;
  const clients = await _getClients(workspaceId);

  return clients.filter((c) => clientIds.includes(c.id)).map((c) => c.name);
}

async function updatePoint(d: Date) {
  const daystamp = d.toISOString().split("T")[0];
  const clientNames = await getPrimeClients(d);
  const hasPrimeMatch = clientNames.includes(togglClientAv.value());

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
