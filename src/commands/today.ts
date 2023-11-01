import { getDueTasks } from "src/services/taskratchet.js";
import cmd from "../lib/cmd.js";

export default cmd("today", async () => {
  await getDueTasks();
  return "hello world";
});
