import makeDaystamp from "src/lib/makeDaystamp.js";

import { reports } from "./index.js";
import { type TogglProjectSummaries } from "./types.js";

export function getProjectSummary(
  workspaceId: number,
  projectId: number,
  startDate: Date,
  endDate: Date
) {
  return reports<TogglProjectSummaries>(
    `workspace/${workspaceId}/projects/${projectId}/summary`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        start_date: makeDaystamp(startDate),
        end_date: makeDaystamp(endDate),
      },
    }
  );
}
