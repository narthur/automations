import makeDaystamp from "src/lib/makeDaystamp.js";
import { reports } from "./index.js";

type TogglProjectSummary = {
  user_id: number;
  project_id: number;
  tracked_seconds: number;
  billable_seconds: number;
};

export default function getProjectsSummary(options: {
  workspaceId: number;
  start: Date;
  end: Date;
}) {
  return reports<TogglProjectSummary[]>(
    `workspace/${options.workspaceId}/projects/summary`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        start_date: makeDaystamp(options.start),
        end_date: makeDaystamp(options.end),
      },
    }
  );
}
