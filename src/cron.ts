import { Cron } from "croner";

import * as billable from "./goals/billable.js";
import * as dynadone from "./goals/dynadone.js";
import * as dynanew from "./goals/dynanew.js";
import * as gross from "./goals/gross.js";
import * as techtainment from "./goals/techtainment.js";
import zeno from "./jobs/zeno.js";

const HALF_HOUR = "0 */30 * * * *" as const;
const TEN_MINUTES = "0 */10 * * * *" as const;
const MINUTE = "0 * * * * *" as const;

new Cron(HALF_HOUR, techtainment.update);
new Cron(TEN_MINUTES, gross.update);
new Cron(MINUTE, zeno);
new Cron(HALF_HOUR, dynanew.update);
new Cron(HALF_HOUR, dynadone.update);
new Cron(HALF_HOUR, billable.update);
