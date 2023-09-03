import { getProjects, getTimeEntries } from "../services/toggl/index.js";
import { isBillable } from "../services/toggl/isBillable.js";
import { createDatapoint } from "../services/beeminder.js";
import dateParams from "../services/toggl/dateParams.js";
import { TimeEntry } from "src/services/toggl/types.js";

export default async function updateBmGross() {
  const entries = await getTimeEntries({ params: dateParams(new Date()) });
  const projects = await getProjects();
  const value: number = entries.reduce(
    (acc: number, entry: TimeEntry): number => {
      if (!entry.project_id) return acc;
      if (entry.duration <= 0) return acc;
      const project = projects.find((p) => p.id === entry.project_id);
      if (!project || !isBillable(project)) return acc;
      const amount = (entry.duration / 3600) * project.rate;
      return acc + amount;
    },
    0
  );
  const daystamp = new Date().toISOString().split("T")[0];

  // TODO: do the same for previous week
  await createDatapoint("narthur", "gross", {
    value,
    daystamp,
    requestid: daystamp,
  });
}
