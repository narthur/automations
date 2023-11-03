import getTimeSummary from "./getTimeSummary.js";
import { getClients, getMe, getProjects } from "./index.js";

type ClientSummary = {
  clientId: number;
  clientName: string;
  clientRate: number;
  tasks: Array<{
    description: string;
    billableHours: number;
  }>;
};

export default async function getBillingSummary({
  startDate,
  endDate,
}: {
  startDate: Date;
  endDate: Date;
}): Promise<Array<ClientSummary>> {
  const { default_workspace_id: workspaceId } = await getMe();

  // projects > entries
  const { groups } = await getTimeSummary({
    workspaceId,
    startDate,
    endDate,
    billable: true,
  });

  const projects = await getProjects();
  const clients = await getClients(workspaceId);

  const summaries = groups.map((g) => {
    const project = projects.find((p) => p.id === g.id);

    if (!project) {
      throw new Error(`No project found for id ${g.id}`);
    }

    if (!project.client_id) {
      throw new Error(`No client found for project id ${project.id}`);
    }

    const client = clients.find((c) => c.id === project.client_id);

    if (!client) {
      throw new Error(`No client found for id ${project.client_id}`);
    }

    const tasks = g.sub_groups.map((e) => {
      const billableHours = e.rates.reduce((sum, r) => {
        const dollarRate = r.hourly_rate_in_cents / 100;
        const multiplier = dollarRate / project.rate;
        const seconds = r.billable_seconds * multiplier;
        const hours = seconds / 60 / 60;
        return sum + hours;
      }, 0);

      return {
        description: e.title || "No description",
        billableHours,
      };
    });

    return {
      clientId: project.client_id,
      clientName: client.name,
      clientRate: project.rate,
      tasks,
    };
  });

  const consolidated = summaries.reduce<Record<number, ClientSummary>>(
    (acc, summary) => {
      const existing = acc[summary.clientId];

      if (!existing) {
        acc[summary.clientId] = summary;
        return acc;
      }

      if (existing.clientRate !== summary.clientRate) {
        throw new Error(
          `Client rate mismatch for client ID ${summary.clientId}: ${existing.clientRate} !== ${summary.clientRate}`
        );
      }

      existing.tasks.push(...summary.tasks);

      return acc;
    },
    {}
  );

  return Object.values(consolidated);
}
