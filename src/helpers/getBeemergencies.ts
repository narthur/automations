import { getGoals } from "../services/beeminder";

export default async function getBeemergencies(): Promise<string> {
  const goals = await getGoals();
  const due = goals.filter((g) => g.safebuf === 0);

  if (due.length === 0) return "No beemergencies!";

  const len = due.reduce((acc, g) => Math.max(acc, g.slug.length + 1), 0);
  const rows = due
    .map((g) => `${g.slug.padEnd(len, " ")}${g.limsum}`)
    .join("\n");

  return `\`\`\`\n${rows}\n\`\`\``;
}
