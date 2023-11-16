import getGoals from "src/services/beeminder/getGoals.js";
import { type GoalExtended } from "src/services/beeminder/types/goalExtended.js";

const TWO_WEEKS = 1_209_600;

function line(g: GoalExtended): string {
  const d = new Date(g.losedate * 1000);
  return `[${g.slug}](${g.url}) due ${d.toLocaleDateString()}`;
}

export default async function beetuning() {
  const goals = await getGoals();
  const due = goals.filter((g) => g.losedate < Date.now() / 1000 + TWO_WEEKS);

  return due.length
    ? due.map(line).join("\n")
    : "No goals due within two weeks";
}
