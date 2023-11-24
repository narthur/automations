import { makeUpdater } from "src/goals/index.js";
import getProjectsSummary, {
  type TogglProjectSummary,
} from "src/services/toggl/getProjectsSummary.js";
import { type TogglMe } from "src/services/toggl/types.js";

import { getMe } from "src/services/toggl/getMe.js";

export const update = makeUpdater({
  user: "narthur",
  goal: "techtainment",
  getSharedData: getMe,
  getDateUpdate: async (d: Date, me: TogglMe) => {
    const projects = await getProjectsSummary({
      workspaceId: me.default_workspace_id,
      start: d,
      end: d,
    });

    const max = projects
      .filter((p) => p.user_id === me.id)
      .reduce<TogglProjectSummary | undefined>(
        (max, p) => (p.tracked_seconds > (max?.tracked_seconds ?? 0) ? p : max),
        projects[0]
      );

    const hours = max ? max.tracked_seconds / 3600 : 0;

    return {
      value: hours * -2,
      comment: max
        ? `Tracked ${hours} hours on project ${max.project_id}`
        : "No projects tracked",
    };
  },
});

export default {
  update,
};
