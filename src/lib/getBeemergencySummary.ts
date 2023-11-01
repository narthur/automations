import getGoals from "src/services/beeminder/getGoals.js";
import table from "text-table";

export default async function getBeemergencySummary(): Promise<string> {
  const goals = await getGoals();
  const due = goals.filter((g) => g.safebuf === 0);

  if (due.length === 0) return "No beemergencies!";

  const data = due.map((g) => [g.slug, g.limsum, `$${g.pledge}`]);

  return `\`\`\`\n${table(data)}\n\`\`\``;
}
