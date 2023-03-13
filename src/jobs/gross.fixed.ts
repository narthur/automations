import { TogglProjectFixedFee, TogglTask } from "../services/toggl.types";
import { getTasks } from "../services/toggl";
import { createDatapoint } from "../services/beeminder";
import { sigfigs } from "./gross";
import { isTaskCompleted } from "../services/toggl.helpers";

export async function handleFixedFeeProjects(projects: TogglProjectFixedFee[]) {
  const promises = projects.map(async (p: TogglProjectFixedFee) => {
    const projectEstimate = p.estimated_hours * 3600 || 0;
    const tasks = await getTasks(p.workspace_id, p.id);
    const capturedValue = tasks.reduce((acc: number, t: TogglTask) => {
      if (isTaskCompleted(t)) {
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

    await createDatapoint("narthur", "gross", {
      value: sigfigs(capturedValue),
      comment: `Toggl: ${p.name}: ${sigfigs(totalTracked)}h of est. ${sigfigs(
        projectEstimate
      )}h for a fixed fee of $${sigfigs(p.fixed_fee)}`,
      requestid: `toggl-${p.id}-fixed`,
    });
  });
  await Promise.all(promises);
}
