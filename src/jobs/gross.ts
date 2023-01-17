import { config } from "dotenv";
import createBeeminderDatapoint from "../lib/bm/createBeeminderDatapoint";
import getSumOfHours from "../lib/getSumOfHours";
import { TimeEntry, TogglProject, TogglTask } from "../types/toggl";
import { getProjects, getTasks, getTimeEntries } from "../lib/toggl";

config();

function dateParams(date?: Date) {
  if (!date) return {};

  const tomorrow = new Date(date);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return {
    start_date: date.toISOString().split("T")[0],
    end_date: tomorrow.toISOString().split("T")[0],
  };
}

const isBillable = (p: TogglProject) => p.billable && p.active;
const isFixedFee = (p: TogglProject) =>
  isBillable(p) && p.fixed_fee && p.estimated_hours > 0;
const isHourly = (p: TogglProject) => isBillable(p) && !p.fixed_fee;

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

async function handleHourlyProjects(projects: TogglProject[]) {
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

async function handleFixedFeeProjects(projects: TogglProject[]) {
  const promises = projects.map(async (p) => {
    const projectEstimate = p.estimated_hours || 0;
    const tasks = await getTasks(p.workspace_id, p.id);
    const capturedValue = tasks.reduce((acc: number, t: TogglTask) => {
      const est = t.estimated_seconds / 3600 || 0;
      const act = t.tracked_seconds / (3600 * 1000) || 0;
      const taken = Math.min(est, act);
      const slice = taken / projectEstimate;

      return slice * p.fixed_fee + acc;
    }, 0);
    const totalTracked = tasks.reduce((acc: number, t: TogglTask) => {
      const act = t.tracked_seconds / (3600 * 1000) || 0;
      return act + acc;
    }, 0);

    await createBeeminderDatapoint("narthur", "gross", {
      value: capturedValue,
      comment: `Toggl: ${p.name}: ${totalTracked}hrs of est. ${projectEstimate}hrs for a fixed fee of $${p.fixed_fee}`,
      requestid: `toggl-${p.id}-fixed`,
    });
  });
  await Promise.all(promises);
}

async function gross() {
  const projects = await getProjects();
  await handleHourlyProjects(projects.filter(isHourly));
  await handleFixedFeeProjects(projects.filter(isFixedFee));
}

if (!process.env.VITEST_WORKER_ID) {
  console.log("running");
  void gross();
  console.log("done");
}

export default gross;
