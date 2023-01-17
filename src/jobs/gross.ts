import { config } from "dotenv";
import createBeeminderDatapoint from "../lib/bm/createBeeminderDatapoint";
import getSumOfHours from "../lib/getSumOfHours";
import { TimeEntry, TogglProject } from "../types/toggl";
import { getProjects, getTimeEntries } from "../lib/toggl";

config();

function getProjectRate(project: TogglProject): number {
  if (!project.fixed_fee) return project.rate;

  const est = project.estimated_hours || 0;
  const act = project.actual_hours || 0;

  if (est > act) return project.fixed_fee / est;
  if (est > 0) return project.fixed_fee / act;

  return 0;
}

function dateParams(date?: Date) {
  if (!date) return {};

  const tomorrow = new Date(date);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return {
    start_date: date.toISOString().split("T")[0],
    end_date: tomorrow.toISOString().split("T")[0],
  };
}

async function getBillableProjects() {
  const projects = await getProjects();
  return projects.filter((p) => p.billable && p.active);
}

function getWeekDates() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d;
  });
}

async function getProjectTimeEntries(
  date: Date
): Promise<Record<string, Array<TimeEntry>>> {
  const entries = await getTimeEntries({
    params: dateParams(date),
  });

  return entries.reduce(
    (acc: Record<string, Array<TimeEntry>>, e: TimeEntry) => ({
      ...acc,
      [e.project_id]: [...(acc[e.project_id] || []), e],
    }),
    {}
  );
}

async function gross() {
  const projects = await getBillableProjects();
  const weekDates = getWeekDates();

  const publishDateData = async (date: Date) => {
    const dateString = date.toISOString().split("T")[0];
    const projectTimeEntries = await getProjectTimeEntries(date);

    const publishProjectData = async (project: TogglProject) => {
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
    };

    await Promise.all(projects.map(publishProjectData));
  };

  await Promise.all(weekDates.map(publishDateData));
}

if (!process.env.VITEST_WORKER_ID) {
  console.log("running");
  void gross();
  console.log("done");
}

export default gross;
