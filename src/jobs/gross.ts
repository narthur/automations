import createBeeminderDatapoint from "../services/bm/createBeeminderDatapoint";
import getSumOfHours from "../services/getSumOfHours";
import {
  TimeEntry,
  TogglProject,
  TogglProjectFixedFee,
  TogglProjectHourly,
  TogglTask,
} from "../types/toggl";
import { getProjects, getTasks, getTimeEntries } from "../services/toggl";
import getWeekDates from "../getWeekDates";
import { isFixedFee, isHourly } from "../services/toggl.helpers";

const SIGFIGS = 2;

function sigfigs(n: number) {
  return +n.toFixed(SIGFIGS);
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

async function handleHourlyProjects(projects: TogglProjectHourly[]) {
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

async function handleFixedFeeProjects(projects: TogglProjectFixedFee[]) {
  const promises = projects.map(async (p: TogglProjectFixedFee) => {
    const projectEstimate = p.estimated_hours * 3600 || 0;
    const tasks = await getTasks(p.workspace_id, p.id);
    const capturedValue = tasks.reduce((acc: number, t: TogglTask) => {
      if (!t.active) {
        // Task has been completed
        const slice = t.estimated_seconds / projectEstimate;
        return slice * p.fixed_fee + acc;
      }

      const est = t.estimated_seconds || 0;
      const act = t.tracked_seconds / 1000 || 0;
      const taken = Math.min(est, act);
      const slice = taken / projectEstimate;

      return slice * p.fixed_fee + acc;
    }, 0);
    const totalTracked = tasks.reduce((acc: number, t: TogglTask) => {
      const act = t.tracked_seconds / (3600 * 1000) || 0;
      return act + acc;
    }, 0);

    await createBeeminderDatapoint("narthur", "gross", {
      value: sigfigs(capturedValue),
      comment: `Toggl: ${p.name}: ${sigfigs(totalTracked)}h of est. ${sigfigs(
        projectEstimate
      )}h for a fixed fee of $${sigfigs(p.fixed_fee)}`,
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

export default gross;
