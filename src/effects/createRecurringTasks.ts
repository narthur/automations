import { createTask } from "../services/taskratchet.js";
import { format, set, nextSunday } from "date-fns";

const tasks = ["Make grocery list", "Go grocery shopping", "Start instant pot"];

export default async function createRecurringTasks() {
  const today = set(new Date(), {
    hours: 23,
    minutes: 59,
    seconds: 0,
    milliseconds: 0,
  });
  const sunday = nextSunday(today);
  const due = format(sunday, "M/d/yyyy, hh:mm a");
  const stakes = 100;

  for (const task of tasks) {
    await createTask(task, due, stakes);
  }
}
