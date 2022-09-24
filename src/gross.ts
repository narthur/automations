import { config } from "dotenv";
import createDatapoint from "./lib/bm/createDatapoint";
import getTimeEntries from "./lib/toggl/getTimeEntries";
import getSum from "./lib/toggl/getSum";

config();

type Project = {
  id: number;
  hours: number;
  total: number;
  label: string;
};

async function gross() {
  const date = new Date().toISOString().split("T")[0];

  const ids = process.env.GROSS_TOGGL_PROJECTS.split(",").map(Number);
  const rates = process.env.GROSS_TOGGL_RATES.split(",").map(Number);
  const labels = process.env.GROSS_TOGGL_LABELS.split(",");

  if (ids.length !== rates.length || ids.length !== labels.length) {
    throw new Error(
      "GROSS_TOGGL_PROJECTS, GROSS_TOGGL_RATES and GROSS_TOGGL_LABELS must have the same length"
    );
  }

  const entries = await getTimeEntries({
    filters: {
      projectIds: ids,
      date,
    },
  });

  const projects: Project[] = ids.reduce((prev: Project[], id, i) => {
    const filtered = entries.filter((e) => e.project_id === id);
    const hours = getSum(filtered);

    return [
      ...prev,
      {
        id,
        hours,
        total: hours * rates[i],
        label: labels[i],
      },
    ];
  }, []);

  await Promise.all(
    projects.map(async (p: Project) => {
      await createDatapoint("narthur", "gross", {
        value: p.total,
        comment: `Toggl: ${p.label}: ${p.hours}hrs`,
        daystamp: date,
        requestid: `toggl-${p.id}-${date}`,
      });
    })
  );
}

if (!process.env.VITEST_WORKER_ID) {
  console.log("running");
  void gross();
  console.log("done");
}

export default gross;
