import { config } from "dotenv";
import createDatapoint from "./lib/bm/createDatapoint";
import getSum from "./lib/toggl/getSum";

config();

async function run() {
  const date = new Date().toISOString().split("T")[0];
  const sum = await getSum({
    filters: {
      projectId: process.env.GROSS_TOGGL_PROJECT,
      date,
    }
  })

  const multiplier = parseFloat(process.env.GROSS_MULTIPLIER_TOGGL);
  const id = `toggl-${date}`;

  await createDatapoint("gross", {
    value: sum * multiplier,
    comment: `Toggl: ${sum}hrs`,
    daystamp: date,
    requestid: id,
  });
}

if (!process.env.VITEST_WORKER_ID) {
  console.log("running");
  void run();
  console.log("done");
}

export default run;
