import { TogglTimeSummary } from "./types.js";
import { reports } from "./index.js";

export default function getTimeSummary(options: {
  workspaceId: number;
  startDate: Date;
  endDate: Date;
  billable?: boolean;
  userIds?: number[];
  grouping?: "projects" | "users" | "clients";
}) {
  return reports<TogglTimeSummary>(
    `workspace/${options.workspaceId}/summary/time_entries`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        start_date: options.startDate.toISOString().split("T")[0],
        end_date: options.endDate.toISOString().split("T")[0],
        billable: options.billable,
        user_ids: options.userIds,
      },
    }
  );
}
