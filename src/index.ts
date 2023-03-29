import * as functions from "firebase-functions";
import gross_ from "./jobs/gross";
import { bmAuths, togglApiToken } from "./secrets";

const gross = functions
  .runWith({
    secrets: [bmAuths.name, togglApiToken.name],
  })
  .pubsub.schedule("every 10 minutes")
  .onRun(gross_);

export { gross };
