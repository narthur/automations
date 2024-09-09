import { getProjects, type Project } from "src/services/narthbugz/index.js";

import cmd, { type Command } from "../lib/cmd.js";
import table from "text-table";

const command: Command = cmd("report", async () => {
  const projects = await getProjects();
  const pending = projects.filter((p) => {
    return (
      p.Status.value !== "Never" && p.Status.value !== "Complete" && !p.Snoozed
    );
  });
  const groups = Object.groupBy(pending, (p) => p.Status.value);
  const columns: (keyof Project)[] = [
    "Name",
    "Last Tracked",
    "Billable Rate",
    "Effective Rate",
    "Estimated",
    "Used",
    "Remaining",
    "Price",
    "Task Count",
  ];

  return Object.entries(groups)
    .map(([status, projects]) => {
      const d = projects?.map((p) => columns.map((c) => p[c] || "-"));
      const t = d && table([columns, ...d]);
      return `${status}:\n\n\`\`\`${t}\`\`\``;
    })
    .join("\n\n");
});

export default command;
