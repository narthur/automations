import { Cron } from "croner";
import avPrime from "./effects/av-prime.js";
import updateBmGross from "./effects/updateBmGross.js";
import morning from "./effects/morning.js";
import createRecurringTasks from "./effects/createRecurringTasks.js";
import zeno from "./effects/zeno.js";
import * as dynanew from "./goals/dynanew.js";

const HALF_HOUR = "0 */30 * * * *" as const;
const TEN_MINUTES = "0 */10 * * * *" as const;
const EVERY_MORNING = "0 0 6 * * *" as const;
const MONDAY_MORNING = "0 0 6 * * 1" as const;
const MINUTE = "0 * * * * *" as const;

new Cron(HALF_HOUR, avPrime);
new Cron(TEN_MINUTES, updateBmGross);
new Cron(EVERY_MORNING, morning);
new Cron(MONDAY_MORNING, createRecurringTasks);
new Cron(MINUTE, zeno);
new Cron(HALF_HOUR, dynanew.update);
