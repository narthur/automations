import { getGoals } from "../services/beeminder";
import table from "text-table";

export default async function getBeemergencies(): Promise<string> {
  const goals = await getGoals();
  const due = goals.filter((g) => g.safebuf === 0);

  if (due.length === 0) return "No beemergencies!";

  const data = due.map((g) => [g.slug, g.limsum, `$${g.pledge}`]);

  return `\`\`\`\n${table(data)}\n\`\`\``;
}
