import { config } from "dotenv";
import createDatapoint from "./lib/bm/createDatapoint";
import getTimeEntries from "./lib/toggl/getTimeEntries";
import getSum from './lib/toggl/getSum';

config();

type Project = {
  id: number;
  hours: number;
  total: number;
};

async function gross() {
  const date = new Date().toISOString().split("T")[0];

  const projectIds = process.env.GROSS_TOGGL_PROJECTS.split(",").map(Number);
  const projectRates = process.env.GROSS_TOGGL_RATES.split(",").map(Number);

  if (projectIds.length !== projectRates.length) {
    throw new Error("GROSS_TOGGL_PROJECTS and GROSS_TOGGL_RATES must have the same number of elements");
  }

  const entries = await getTimeEntries({
    filters: {
      projectIds,
      date,
    }
  })

  const projects: Project[] = projectIds.reduce((prev: Project[], id, i) => {
    const filtered = entries.filter(e => e.project_id === id);
    const hours = getSum(filtered);
    
    return [
      ...prev,
      {
        id,
        hours,
        total: hours * projectRates[i],
      }
    ]
  }, []);

  await Promise.all(projects.map(async (p: Project) => {
    await createDatapoint("gross", {
      value: p.total,
      comment: `Toggl: ${p.hours}hrs`,
      daystamp: date,
      requestid: `toggl-${p.id}-${date}`,
    });
  }));
}

if (!process.env.VITEST_WORKER_ID) {
  console.log("running");
  void gross();
  console.log("done");
}

export default gross;
