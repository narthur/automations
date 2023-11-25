import { getPendingTasks } from "src/services/taskratchet/index.js";

import { createAlarmTrigger } from "./index.js";

export const send = createAlarmTrigger({
  id: "tr",
  getItems: async () => {
    const tasks = await getPendingTasks();
    return tasks.map((t) => ({
      name: t.task,
      timestamp: t.due_timestamp,
    }));
  },
});

export default {
  send,
};
