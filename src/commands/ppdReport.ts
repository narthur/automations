import { getProjects } from "src/services/narthbugz/index.js";

import cmd, { type Command } from "../lib/cmd.js";

const command: Command = cmd("report", async () => {
  const projects = await getProjects();

  return JSON.stringify(projects);
});

export default command;
