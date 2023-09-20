import { getProjects, getTimeEntries } from "../services/toggl/index.js";
import { isBillable } from "../services/toggl/isBillable.js";
import { createDatapoint } from "../services/beeminder.js";
import dateParams from "../services/toggl/dateParams.js";
import { TimeEntry, TogglProject } from "src/services/toggl/types.js";
import getWeekDates from "./getWeekDates.js";

async function doUpdate(date: Date, projects: TogglProject[]) {
  const entries = await getTimeEntries({ params: dateParams(date) });
  const value: number = entries.reduce(
    (acc: number, entry: TimeEntry): number => {
      if (!entry.project_id) return acc;
      if (entry.duration <= 0) return acc;
      const project = projects.find((p) => p.id === entry.project_id);
      if (!project || !isBillable(project) || !entry.billable) return acc;
      const amount = (entry.duration / 3600) * project.rate;
      return acc + amount;
    },
    0
  );
  const daystamp = new Date().toISOString().split("T")[0];

  await createDatapoint("narthur", "gross", {
    value,
    daystamp,
    requestid: daystamp,
  });
}

export default async function updateBmGross() {
  const dates = getWeekDates();
  const projects = await getProjects();

  await Promise.all(dates.map((d) => doUpdate(d, projects)));
}
