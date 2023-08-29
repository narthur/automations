import * as functions from "firebase-functions";
import { createTask } from "../services/taskratchet";
import { nextSaturday, format, set } from "date-fns";
import { allTaskratchet } from "../secrets";

const tasks = ["Make grocery list", "Go grocery shopping", "Start instant pot"];

export const reratchet_cron = functions
  .runWith({
    secrets: [...allTaskratchet],
  })
  .pubsub.schedule("0 1 * * 0") // every Sunday at 1:00 AM
  .onRun(async () => {
    const today = set(new Date(), {
      hours: 23,
      minutes: 59,
      seconds: 0,
      milliseconds: 0,
    });
    const saturday = nextSaturday(today);
    const due = format(saturday, "M/d/yyyy, hh:mm a");
    const stakes = 100;

    for (const task of tasks) {
      await createTask(task, due, stakes);
    }
  });
