import { __loadResponse } from "axios";
import { PROJECTS } from "../../../vitest.setup";

export default function loadTimeEntries(entries: Record<string, unknown>[]) {
  __loadResponse({
    url: /me\/time_entries/,
    payload: {
      data: entries.map((e) => {
        return {
          project_id: PROJECTS[0].id,
          duration: 3600,
          start: "2022-08-10T16:50:07+00:00",
          ...e,
        };
      }),
    },
  });
}
