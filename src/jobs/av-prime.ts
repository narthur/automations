import { createDatapoint } from "../services/beeminder";
import { getClients, getProjects, getTimeEntries } from "../services/toggl";
import { togglClientAv } from "../secrets";
import dateParams from "../helpers/dateParams";
import getWeekDates from "../helpers/getWeekDates";
import memoize from "src/helpers/memoize";

const _getProjects = memoize(getProjects, "getProjects");
const _getClients = memoize(getClients, "getClients");

async function getPrimeClients(date: Date): Promise<string[]> {
  const entries = await getTimeEntries({
    params: dateParams(date),
  });
  const primeEntries = entries.filter((e) => e.tags.includes("prime"));

  if (!primeEntries?.length) return [];

  const projectIds = [...new Set(primeEntries.map((e) => e.project_id))];
  const projects = await _getProjects();
  const primeProjects = projects.filter((p) => projectIds.includes(p.id));
  const clientIds = [...new Set(primeProjects.map((p) => p.client_id))];
  const workspaceId = entries[0].workspace_id;
  const clients = await _getClients(workspaceId);

  if (!clients?.length) {
    throw new Error("Could not get clients");
  }

  return clients.filter((c) => clientIds.includes(c.id)).map((c) => c.name);
}

async function updatePoint(d: Date) {
  const daystamp = d.toISOString().split("T")[0];
  const clientNames = await getPrimeClients(d);
  const hasPrimeMatch = clientNames.includes(togglClientAv.value());

  return createDatapoint("narthur", "audioprime", {
    value: hasPrimeMatch ? 1 : 0,
    daystamp,
    requestid: daystamp,
    comment: clientNames.join(", "),
  });
}

export default async function avPrime() {
  return Promise.all(getWeekDates().map(updatePoint));
}
