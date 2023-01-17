import { config } from "dotenv";
import createBeeminderDatapoint from "../lib/bm/createBeeminderDatapoint";
import getTimeEntries, { TimeEntry } from "../lib/toggl/getTimeEntries";
import getSumOfHours from "../lib/toggl/getSumOfHours";
import getProjects, { TogglProject } from "../lib/toggl/getProjects";

config();

function getProjectRate(project: TogglProject): number {
  if (!project.fixed_fee) return project.rate;

  const est = project.estimated_hours || 0;
  const act = project.actual_hours || 0;

  if (est > act) return project.fixed_fee / est;
  if (est > 0) return project.fixed_fee / act;

  return 0;
}

async function gross() {
  const workspaceProjects = await getProjects();

  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d;
  });

  const promises = weekDates.map(async (date) => {
    const dateString = date.toISOString().split("T")[0];

    const timeEntries = await getTimeEntries({
      filters: {
        date,
      },
    });

    const projectTimeEntries = timeEntries.reduce(
      (acc: Record<string, Array<TimeEntry>>, timeEntry: TimeEntry) => {
        if (acc[timeEntry.project_id]) {
          acc[timeEntry.project_id].push(timeEntry);
        } else {
          acc[timeEntry.project_id] = [timeEntry];
        }

        return acc;
      },
      {}
    );

    workspaceProjects.forEach((project: TogglProject) => {
      const v =
        getSumOfHours(projectTimeEntries[project.id]) * getProjectRate(project);
      void createBeeminderDatapoint("narthur", "gross", {
        value: v,
        comment: `Toggl: ${project.name}: ${v}hrs`,
        requestid: `toggl-${project.id}-${dateString}`,
      });
    });
  });

  await Promise.all(promises);
}

if (!process.env.VITEST_WORKER_ID) {
  console.log("running");
  void gross();
  console.log("done");
}

export default gross;
