import { Cron } from "croner";
import * as techtainment from "./goals/techtainment.js";
import * as gross from "./goals/gross.js";
import morning from "./jobs/morning.js";
import zeno from "./jobs/zeno.js";
import * as dynanew from "./goals/dynanew.js";
import * as dynadone from "./goals/dynadone.js";

const HALF_HOUR = "0 */30 * * * *" as const;
const TEN_MINUTES = "0 */10 * * * *" as const;
const EVERY_MORNING = "0 0 6 * * *" as const;
const MINUTE = "0 * * * * *" as const;

new Cron(HALF_HOUR, techtainment.update);
new Cron(TEN_MINUTES, gross.update);
new Cron(EVERY_MORNING, morning);
new Cron(MINUTE, zeno);
new Cron(HALF_HOUR, dynanew.update);
new Cron(HALF_HOUR, dynadone.update);
