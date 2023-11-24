import { runQuery } from "src/services/index.js";
import getProjectsSummary from "src/services/toggl/getProjectsSummary.js";

import { makeUpdater } from "./index.js";

export const update = makeUpdater({
  user: "narthur",
  goal: "billable",
  getSharedData: () => {
    return runQuery<{
      togglMe: { id: string; default_workspace_id: number };
    }>(`
    query {
      togglMe {
        id
        default_workspace_id
      }
    }
    `);
  },
  getDateUpdate: async (date, { togglMe }) => {
    const projects = await getProjectsSummary({
      workspaceId: togglMe.default_workspace_id,
      start: date,
      end: date,
    });

    const billableSeconds = projects
      .filter((p) => p.user_id.toString() === togglMe.id)
      .reduce((sum, p) => sum + p.billable_seconds, 0);

    return {
      value: billableSeconds / 3600,
    };
  },
});
