import { getProjects } from "src/services/narthbugz/index.js";

import cmd, { type Command } from "../lib/cmd.js";

const command: Command = cmd("report", async () => {
  const projects = await getProjects();
  const pending = projects.filter((p) => {
    return p.Status.value !== "Never" && p.Status.value !== "Complete";
  });

  return pending.map((p) => `${p.Name} - ${p.Status.value}`).join("\n");
});

export default command;
