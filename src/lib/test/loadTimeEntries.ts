import { __loadResponse } from "axios";
import { PROJECTS } from "../../../vitest.setup";
import { vi } from "vitest";
import { getTimeEntries } from "../toggl";

export default function loadTimeEntries(entries: Record<string, unknown>[]) {
  const data = entries.map((e) => {
    return {
      project_id: PROJECTS[0].id,
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

  vi.mocked(getTimeEntries).mockResolvedValue(data as any);
}
