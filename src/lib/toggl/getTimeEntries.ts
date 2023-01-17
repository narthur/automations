import axios from "axios";

export type Options = {
  filters?: {
    projectIds?: number[];
    date?: Date;
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

function dateParams(date?: Date) {
  if (!date) {
    return {};
  }

  const tomorrow = new Date(date);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return {
    start_date: date.toISOString().split("T")[0],
    end_date: tomorrow.toISOString().split("T")[0],
  };
}

export default async function getTimeEntries(options: Options = {}) {
  const url = "https://api.track.toggl.com/api/v9/me/time_entries";
  const auth = Buffer.from(`${process.env.TOGGL_API_TOKEN}:api_token`).toString(
    "base64"
  );
  const params = dateParams(options.filters?.date);
  const response = await axios
    .get<TimeEntry[]>(url, {
      headers: {
        Authorization: `Basic ${auth}`,
      },
      params,
    })
    .catch((error) => {
      console.error("Error fetching time entries");
      console.error("URL:", url);
      console.error("Params:", params);
      console.error(error);
      throw error;
    });

  return response.data.filter((entry: TimeEntry): boolean => {
    if (
      options.filters?.projectIds?.length &&
      !options.filters.projectIds.includes(entry.project_id)
    ) {
      return false;
    }

    return true;
  });
}
