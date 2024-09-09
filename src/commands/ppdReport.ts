import { getProjects, type Project } from "src/services/narthbugz/index.js";

import cmd, { type Command } from "../lib/cmd.js";
import table from "text-table";

type Column = {
  key: keyof Project;
  head?: string;
  format?: (value: unknown) => string;
};

const columns: Column[] = [
  {
    key: "Name",
    format: (v) => String(v).substring(0, 10),
  },
  {
    key: "Last Tracked",
    head: "Tracked",
    format: (v) => (v ? new Date(String(v)).toLocaleDateString() : "-"),
  },
  {
    key: "Billable Rate",
    head: "Rate",
    format: (v) => `$${Number(v)}`,
  },
  {
    key: "Effective Rate",
    head: "Eff Rate",
    format: (v) => `$${Number(v)}`,
  },
  {
    key: "Estimated",
    head: "Est",
  },
  {
    key: "Used",
  },
  {
    key: "Remaining",
    head: "Left",
    format: (v) => String(Number(v)),
  },
  {
    key: "Price",
    format: (v) => `$${Number(v)}`,
  },
  {
    key: "Task Count",
    head: "Tasks",
  },
];

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
      const d = projects?.map((p) =>
        columns.map((c) => {
          const v = p[c.key];
          if (!v) return "-";
          if (c.format) return c.format(v);
          return v;
        })
      );
      const h = columns.map((c) => c.head ?? c.key);
      const t = d && table([h, ...d]);
      return `${status}:\n\n\`\`\`\n${t}\n\`\`\``;
    })
    .join("\n\n");
});

export default command;
