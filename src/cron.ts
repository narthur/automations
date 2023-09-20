import { Cron } from "croner";
import avPrime from "./effects/av-prime.js";
import updateBmGross from "./effects/updateBmGross.js";
import morning from "./effects/morning.js";
import createRecurringTasks from "./effects/createRecurringTasks.js";
import zeno from "./effects/zeno.js";

const SCHEDULES = {
  half_hour: "0 */30 * * * *",
  ten_minutes: "0 */10 * * * *",
  morning: "0 0 6 * * *",
  monday_morning: "0 0 6 * * 1",
  minute: "0 * * * * *",
};

new Cron(SCHEDULES.half_hour, avPrime);
new Cron(SCHEDULES.ten_minutes, updateBmGross);
new Cron(SCHEDULES.morning, morning);
new Cron(SCHEDULES.monday_morning, createRecurringTasks);
new Cron(SCHEDULES.minute, zeno);
