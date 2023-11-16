import getGoals from "./getGoals.js";
import { type GoalExtended } from "./types/goalExtended.js";

export default async function getBeemergencies(): Promise<GoalExtended[]> {
  const goals = await getGoals();
  return goals.filter((g) => g.safebuf === 0);
}
