import getBeemergencies from "src/services/beeminder/getBeemergencies.js";
import { getDueTasks } from "src/services/taskratchet.js";

import cmd from "../lib/cmd.js";

export default cmd("today", async () => {
  await getDueTasks();
  await getBeemergencies();
  return "hello world";
});
