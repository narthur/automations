import { TogglTimeSummary } from "./types.js";
import { reports } from "./index.js";
import makeDaystamp from "src/transforms/makeDaystamp.js";

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
        start_date: makeDaystamp(options.startDate),
        end_date: makeDaystamp(options.endDate),
        billable: options.billable,
        user_ids: options.userIds,
      },
    }
  );
}
