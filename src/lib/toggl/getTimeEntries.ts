import axios from "axios";

export type Options = {
  filters?: {
    projectId?: string;
    date?: string;
  };
};

export type TimeEntry = {
  duration: number;
  start: string;
  project_id: string;
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
      options.filters?.projectId &&
      entry.project_id !== options.filters.projectId
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
