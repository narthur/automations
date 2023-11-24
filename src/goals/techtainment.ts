import { makeUpdater } from "src/goals/index.js";
import { runQuery } from "src/services";
import getProjectsSummary, {
  type TogglProjectSummary,
} from "src/services/toggl/getProjectsSummary.js";

export const update = makeUpdater({
  user: "narthur",
  goal: "techtainment",
  getSharedData: () => {
    return runQuery<{
      togglMe: {
        id: string;
        default_workspace_id: number;
      };
    }>(`
    query {
      togglMe {
        id
        default_workspace_id
      }
    }
    `);
  },
  getDateUpdate: async (d, { togglMe }) => {
    const projects = await getProjectsSummary({
      workspaceId: togglMe.default_workspace_id,
      start: d,
      end: d,
    });

    const max = projects
      .filter((p) => p.user_id.toString() === togglMe.id)
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
