import axios from "axios";

export type Options = {
  filters?: {
    projectIds?: number[];
    date?: string;
  };
};

// https://developers.track.toggl.com/docs/api/time_entries
export type TimeEntry = {
  at: string;
  billable: boolean;
  description: string;
  duration: number;
  duronly: boolean;
  id: number;
  pid: number;
  project_id: number;
  server_deleted_at: string;
  start: string;
  stop: string;
  tag_ids: number[];
  tags: string[];
  task_id: number;
  tid: number;
  uid: number;
  user_id: number;
  wid: number;
  workspace_id: number;
};

export default async function getTimeEntries(options: Options = {}) {
  const url = "https://api.track.toggl.com/api/v9/me/time_entries";
  const auth = Buffer.from(`${process.env.TOGGL_API_TOKEN}:api_token`).toString(
    "base64"
  );

  const { data } = await axios.get<TimeEntry[]>(url, {
    headers: {
      Authorization: `Basic ${auth}`,
    },
  });

  return data.filter((entry: TimeEntry): boolean => {
    if (
      options.filters?.projectIds?.length &&
      !options.filters.projectIds.includes(entry.project_id)
    ) {
      return false;
    }

    if (
      options.filters?.date &&
      entry.start.indexOf(options.filters.date) === -1
    ) {
      return false;
    }

    return true;
  });
}
