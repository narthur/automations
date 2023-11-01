import { getPendingTasks } from "src/services/taskratchet.js";
import cmd from "./cmd.js";

export default cmd("taskratchet", async () => {
  const tasks = await getPendingTasks();
  return tasks.map((t) => `${t.task} due ${t.due} or pay $${t.cents / 100}`);
});
