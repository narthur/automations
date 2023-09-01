import * as functions from "firebase-functions";
import { getProjects, getTimeEntries } from "../services/toggl";
import { isBillable } from "src/services/toggl/isBillable";
import { createDatapoint } from "../services/beeminder";
import dateParams from "../services/toggl/dateParams";
import setCors from "../effects/setCors";
import { allBm, allToggl } from "../secrets";

async function run() {
  const entries = await getTimeEntries({ params: dateParams(new Date()) });
  const projects = await getProjects();
  const value = entries.reduce((acc, entry) => {
    if (!entry.project_id) return acc;
    if (entry.duration <= 0) return acc;
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
  .runWith({
    secrets: [...allToggl, ...allBm],
  })
  .pubsub.schedule("every 10 minutes")
  .onRun(run);

export const gross_http = functions
  .runWith({
    secrets: [...allToggl, ...allBm],
  })
  .https.onRequest(async (req, res) => {
    setCors(res);
    await run();
    res.status(200).send("OK");
  });
