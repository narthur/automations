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
  const projects = await getProjects();
  const active = projects.filter((p) => p.active);
  const billable = active.filter((p) => p.billable);

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

    const p = billable.map(async (project: TogglProject) => {
      const e = projectTimeEntries[project.id];
      const t = getSumOfHours(e);
      const r = getProjectRate(project);
      const v = t * r;
      if (t === 0) return;
      await createBeeminderDatapoint("narthur", "gross", {
        value: v,
        comment: `Toggl: ${project.name}: ${t}hrs @ $${r}/hr`,
        requestid: `toggl-${project.id}-${dateString}`,
        daystamp: dateString.replace(/-/g, ""),
      });
    });

    await Promise.all(p);
  });

  await Promise.all(promises);
}

if (!process.env.VITEST_WORKER_ID) {
  console.log("running");
  void gross();
  console.log("done");
}

export default gross;
