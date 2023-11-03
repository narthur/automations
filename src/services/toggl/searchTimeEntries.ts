// https://developers.track.toggl.com/docs/reports/detailed_reports#post-search-time-entries

import makeDaystamp from "src/lib/makeDaystamp.js";
import { reports } from "./index.js";

type ReturnType = {
  groups: {
    id: number;
    sub_groups: {
      id: number | null;
      title: string;
      seconds: number;
      rates: {
        billable_seconds: number;
        hourly_rate_in_cents: number;
        currency: string;
      }[];
    }[];
  }[];
};

export default function searchTimeEntries(o: {
  workspaceId: number;
  billable?: boolean;
  clientIds?: number[];
  description?: string;
  endDate?: Date;
  firstId?: number;
  firstRowNumber?: number;
  firstTimestamp?: number;
  groupIds?: number[];
  grouped?: boolean;
  hideAmounts?: boolean;
  maxDurationSeconds?: number;
  minDurationSeconds?: number;
  orderBy?: "date" | "user" | "duration" | "description" | "last_update";
  orderDir?: "ASC" | "DESC";
  pageSize?: number;
  postedFields?: string[];
  projectIds?: number[];
  rounding?: number;
  roundingMinutes?: number;
  startTime?: string;
  startDate?: Date;
  tagIds?: number[];
  taskIds?: number[];
  timeEntryIds?: number[];
  userIds?: number[];
}) {
  return reports<ReturnType>(
    `workspaces/${o.workspaceId}/search/time_entries`,
    {
      params: {
        billable: o.billable,
        client_ids: o.clientIds,
        description: o.description,
        end_date: o.endDate && makeDaystamp(o.endDate),
        first_id: o.firstId,
        first_row_number: o.firstRowNumber,
        first_timestamp: o.firstTimestamp,
        group_ids: o.groupIds,
        grouped: o.grouped,
        hide_amounts: o.hideAmounts,
        max_duration_seconds: o.maxDurationSeconds,
        min_duration_seconds: o.minDurationSeconds,
        order_by: o.orderBy,
        order_dir: o.orderDir,
        page_size: o.pageSize,
        posted_fields: o.postedFields,
        project_ids: o.projectIds,
        rounding: o.rounding,
        rounding_minutes: o.roundingMinutes,
        start_time: o.startTime,
        start_date: o.startDate && makeDaystamp(o.startDate),
        tag_ids: o.tagIds,
        task_ids: o.taskIds,
        time_entry_ids: o.timeEntryIds,
        user_ids: o.userIds,
      },
    }
  );
}
