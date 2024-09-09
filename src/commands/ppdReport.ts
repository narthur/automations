import { getProjects } from "src/services/narthbugz/index.js";

import cmd, { type Command } from "../lib/cmd.js";

const command: Command = cmd("report", async () => {
  const projects = await getProjects();
  const pending = projects.filter((p) => {
    return (
      p.Status.value !== "Never" && p.Status.value !== "Complete" && !p.Snoozed
    );
  });
  const groups = Object.groupBy(pending, (p) => p.Status.value);

  return Object.entries(groups)
    .map(([status, projects]) => {
      return `${status}:\n${projects?.map((p) => `  - ${p.Name}`).join("\n")}`;
    })
    .join("\n\n");
});

export default command;
