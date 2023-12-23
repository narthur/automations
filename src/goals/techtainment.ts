import { makeUpdater } from "src/goals/index.js";
import { getMe } from "src/services/toggl/getMe.js";
import getTimeSummary from "src/services/toggl/getTimeSummary";
import { type TogglMe } from "src/services/toggl/types.js";

export const update = makeUpdater({
  user: "narthur",
  goal: "techtainment",
  getSharedData: getMe,
  getDateUpdate: async (d: Date, me: TogglMe) => {
    const { groups } = await getTimeSummary({
      workspaceId: me.default_workspace_id,
      startDate: d,
      endDate: d,
      grouping: "users",
      userIds: [me.id],
    });

    const entries = groups[0]?.sub_groups ?? [];
    const hours = entries.reduce((acc, entry) => acc + entry.seconds / 3600, 0);

    return {
      value: hours * -2,
    };
  },
});

export default {
  update,
};
