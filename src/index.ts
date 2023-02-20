import * as functions from "firebase-functions";
import gross_ from "./jobs/gross";

const gross = functions.pubsub
  .schedule("every 10 minutes")
  .onRun(() => gross_());

export { gross };
