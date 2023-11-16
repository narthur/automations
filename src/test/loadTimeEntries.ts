import { __loadResponse } from "axios";
import { vi } from "vitest";

import { getTimeEntries } from "../services/toggl/index.js";
import { type TimeEntry } from "../services/toggl/types.js";

const PROJECTS = [
  {
    id: 0,
    rate: 10,
    label: "Project 0",
  },
  {
    id: 1,
    rate: 20,
    label: "Project 1",
  },
];

export default function loadTimeEntries(entries: Partial<TimeEntry>[]) {
  const data = entries.map((e): Partial<TimeEntry> => {
    return {
      project_id: PROJECTS[0]!.id,
      duration: 3600,
      start: "2022-08-10T16:50:07+00:00",
      ...e,
    };
  });

  __loadResponse({
    url: /me\/time_entries/,
    payload: {
      data,
    },
  });

  vi.mocked(getTimeEntries).mockResolvedValue(data as TimeEntry[]);
}
