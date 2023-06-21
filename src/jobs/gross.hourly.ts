import {
  TimeEntry,
  TogglProject,
  TogglProjectHourly,
} from "../services/toggl.types";
import { getTimeEntries } from "../services/toggl";
import getWeekDates from "../helpers/getWeekDates";
import { getSumOfHours } from "../services/toggl.helpers";
import { createDatapoint } from "../services/beeminder";
import { sigfigs } from "./gross";
import dateParams from "src/helpers/dateParams";

async function getProjectTimeEntries(
  date: Date
): Promise<Record<string, Array<TimeEntry>>> {
  const entries = await getTimeEntries({
    params: dateParams(date),
  });

  return entries.reduce(
    (acc: Record<string, Array<TimeEntry>>, e: TimeEntry) => ({
      ...acc,
      [e.project_id || "NONE"]: [...(acc[e.project_id || "NONE"] || []), e],
    }),
    {}
  );
}

export async function handleHourlyProjects(projects: TogglProjectHourly[]) {
  const weekDates = getWeekDates();

  const publishDateData = async (date: Date) => {
    const dateString = date.toISOString().split("T")[0];
    const projectTimeEntries = await getProjectTimeEntries(date);

    const publishProjectData = async (project: TogglProject) => {
      const e = projectTimeEntries[project.id];
      const t = getSumOfHours(e);
      const r = project.rate;
      const v = t * r;
      if (t === 0) return;
      await createDatapoint("narthur", "gross", {
        value: sigfigs(v),
        comment: `Toggl: ${project.name}: ${sigfigs(t)}h @ $${r}/h`,
        requestid: `toggl-${project.id}-${dateString}`,
        daystamp: dateString.replace(/-/g, ""),
      });
    };

    await Promise.all(projects.map(publishProjectData));
  };

  await Promise.all(weekDates.map(publishDateData));
}
