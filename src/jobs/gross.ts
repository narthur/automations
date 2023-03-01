import { getProjects } from "../services/toggl";
import { isFixedFee, isHourly } from "../services/toggl.helpers";
import { handleHourlyProjects } from "./gross.hourly";
import { handleFixedFeeProjects } from "./gross.fixed";

const SIGFIGS = 2;

export function sigfigs(n: number) {
  return +n.toFixed(SIGFIGS);
}

async function gross() {
  const projects = await getProjects();
  await handleHourlyProjects(projects.filter(isHourly));
  await handleFixedFeeProjects(projects.filter(isFixedFee));
}

export default gross;
