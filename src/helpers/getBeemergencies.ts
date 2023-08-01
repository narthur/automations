import { getGoals } from "../services/beeminder";

export default async function getBeemergencies(): Promise<string> {
  const goals = await getGoals();
  const due = goals.filter((g) => g.safebuf === 0);

  if (due.length === 0) return "No beemergencies!";

  const slugLengths = due.map((g) => g.slug.length);
  const len = Math.max(...slugLengths);
  const rows = due
    .map((g) => `${g.slug.padEnd(len, " ")} ${g.limsum}`)
    .join("\n");

  return `\`\`\`\n${rows}\n\`\`\``;
}
