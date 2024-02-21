import { Cron } from "croner";

import bm from "./alarms/bm.js";
import tr from "./alarms/tr.js";
import * as bmGoal from "./goals/bm.js";
import * as dynadone from "./goals/dynadone.js";
import * as dynanew from "./goals/dynanew.js";
import * as gross from "./goals/gross.js";
import * as techtainment from "./goals/techtainment.js";

const HALF_HOUR = "0 */30 * * * *" as const;
const TEN_MINUTES = "0 */10 * * * *" as const;
const MINUTE = "0 * * * * *" as const;

const options = {
  catch: (e: unknown) => console.error(e),
};

new Cron(HALF_HOUR, options, dynadone.update);
new Cron(HALF_HOUR, options, dynanew.update);
new Cron(MINUTE, options, bm.send);
new Cron(MINUTE, options, tr.send);
new Cron(TEN_MINUTES, options, bmGoal.update);
new Cron(TEN_MINUTES, options, gross.update);
new Cron(TEN_MINUTES, options, techtainment.update);
