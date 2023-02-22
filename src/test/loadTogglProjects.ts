import { __loadResponse } from "axios";
import { vi } from "vitest";
import { getProjects } from "../services/toggl";
import { TogglProject } from "../types/toggl";

export default function loadTogglProjects(
  projects: Array<Partial<TogglProject>>
): TogglProject[] {
  const data = projects.map((p): TogglProject => {
    return {
      billable: true,
      active: true,
      at: "2021-09-01T00:00:00+00:00",
      cid: 0,
      color: "#000000",
      created_at: "2021-09-01T00:00:00+00:00",
      current_period: {
        end_date: "2021-09-01T00:00:00+00:00",
        start_date: "2021-09-01T00:00:00+00:00",
      },
      end_date: "2021-09-01T00:00:00+00:00",
      first_time_entry: "2021-09-01T00:00:00+00:00",
      id: 0,
      is_private: true,
      name: "Project",
      rate: 0,
      recurring: false,
      start_date: "2021-09-01T00:00:00+00:00",
      wid: 0,
      workspace_id: 0,
      ...p,
    };
  });

  vi.mocked(getProjects).mockResolvedValue(data);

  __loadResponse({
    url: /\/projects$/,
    payload: {
      data,
    },
  });

  return data;
}
