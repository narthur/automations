import { createDatapoint } from "../services/beeminder";
import { getClients, getProjects, getTimeEntries } from "../services/toggl";
import { togglClientAv } from "../secrets";
import dateParams from "../helpers/dateParams";
import getWeekDates from "../helpers/getWeekDates";

async function hasPrimeMatch(date: Date): Promise<boolean> {
  const entries = await getTimeEntries({
    params: dateParams(date),
  });
  const primeEntries = entries.filter((e) => e.tags.includes("prime"));

  if (!primeEntries?.length) return false;

  const projectIds = [...new Set(primeEntries.map((e) => e.project_id))];
  const projects = await getProjects();
  const primeProjects = projects.filter((p) => projectIds.includes(p.id));
  const clientIds = [...new Set(primeProjects.map((p) => p.client_id))];
  const workspaceId = entries[0].workspace_id;
  const clients = await getClients(workspaceId);

  if (!clients?.length) {
    throw new Error("Could not get clients");
  }

  const avClient = clients.find((c) => c.name === togglClientAv.value());

  if (!avClient) {
    throw new Error("Could not find client");
  }

  return clientIds.includes(avClient.id);
}

async function updatePoint(d: Date) {
  const daystamp = d.toISOString().split("T")[0];
  return createDatapoint("narthur", "audioprime", {
    value: (await hasPrimeMatch(d)) ? 1 : 0,
    daystamp,
    requestid: daystamp,
    comment: "via narthur/automations",
  });
}

export default async function avPrime() {
  return Promise.all(getWeekDates().map(updatePoint));
}
