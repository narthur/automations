import { getMe } from "src/services/toggl/getMe.js";
import getProjectsSummary from "src/services/toggl/getProjectsSummary.js";

import { makeUpdater } from "./index.js";

// TODO: Make sure this is only tracking my own time, not Luke's
export const update = makeUpdater({
  user: "narthur",
  goal: "billable",
  getSharedData: getMe,
  getDateUpdate: async (date, me) => {
    const projects = await getProjectsSummary({
      workspaceId: me.default_workspace_id,
      start: date,
      end: date,
    });

    const billableSeconds = projects
      .filter((p) => p.user_id === me.id)
      .reduce((sum, p) => sum + p.billable_seconds, 0);

    return {
      value: billableSeconds / 3600,
    };
  },
});
