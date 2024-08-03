import { Cron } from "croner";

import bm from "./jobs/alarms/bm.js";
import tr from "./jobs/alarms/tr.js";
import dynaSnooze from "./jobs/dynaSnooze.js";
import * as bmGoal from "./jobs/goals/bm.js";
import * as gross from "./jobs/goals/gross.js";
import * as techtainment from "./jobs/goals/techtainment.js";
import syncIssues from "./jobs/syncIssues.js";

const HALF_HOUR = "0 */30 * * * *" as const;
const TEN_MINUTES = "0 */10 * * * *" as const;
const MINUTE = "0 * * * * *" as const;

const options = {
  catch: (e: unknown) => console.error(e),
};

new Cron(HALF_HOUR, options, dynaSnooze);
new Cron(HALF_HOUR, options, syncIssues);
new Cron(MINUTE, options, bm.send);
new Cron(MINUTE, options, tr.send);
new Cron(TEN_MINUTES, options, bmGoal.update);
new Cron(TEN_MINUTES, options, gross.update);
new Cron(TEN_MINUTES, options, techtainment.update);
