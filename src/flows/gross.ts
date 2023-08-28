import * as functions from "firebase-functions";
import { getProjects, getTimeEntries } from "../services/toggl";
import { isBillable } from "../services/toggl.helpers";
import { createDatapoint } from "../services/beeminder";
import dateParams from "../transforms/dateParams";

async function run() {
  const entries = await getTimeEntries({ params: dateParams(new Date()) });
  const projects = await getProjects();
  const value = entries.reduce((acc, entry) => {
    if (!entry.project_id) return acc;
    const project = projects.find((p) => p.id === entry.project_id);
    if (!project || !isBillable(project)) return acc;
    const amount = (entry.duration / 3600) * project.rate;
    return acc + amount;
  }, 0);
  const daystamp = new Date().toISOString().split("T")[0];

  // TODO: do the same for previous week
  await createDatapoint("narthur", "gross", {
    value,
    daystamp,
    requestid: daystamp,
  });
}

export const gross_cron = functions
  .runWith({})
  .pubsub.schedule("every 10 minutes")
  .onRun(run);

export const gross_http = functions.https.onRequest(async (req, res) => {
  await run();
  res.status(200).send("OK");
});
