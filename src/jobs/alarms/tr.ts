import { getPendingTasks } from "src/services/taskratchet.js";

import { createAlarmTrigger } from "./index.js";

export const send = createAlarmTrigger({
  id: "tr",
  getItems: async () => {
    const tasks = await getPendingTasks();
    return tasks.map((t) => ({
      name: t.task,
      timestamp: t.due,
    }));
  },
});

export default {
  send,
};
