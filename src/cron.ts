import { Cron } from "croner";
import avPrime from "./effects/av-prime.js";
import updateBmGross from "./effects/updateBmGross.js";
import morning from "./effects/morning.js";
import createRecurringTasks from "./effects/createRecurringTasks.js";
import zeno from "./effects/zeno.js";

// every 30 minutes
export const avPrimeCron = new Cron("0 */30 * * * *", avPrime);

// every 10 minutes
export const grossCron = new Cron("0 */10 * * * *", updateBmGross);

// every morning at 6am
export const morningCron = new Cron("0 0 6 * * *", morning);

// every Monday morning
export const mondayCron = new Cron("0 0 6 * * 1", createRecurringTasks);

// every minute
export const zenoCron = new Cron("0 * * * * *", zeno);
