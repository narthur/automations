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

new Cron(HALF_HOUR, dynadone.update);
new Cron(HALF_HOUR, dynanew.update);
new Cron(MINUTE, bm.send);
new Cron(MINUTE, tr.send);
new Cron(TEN_MINUTES, bmGoal.update);
new Cron(TEN_MINUTES, gross.update);
new Cron(TEN_MINUTES, techtainment.update);
