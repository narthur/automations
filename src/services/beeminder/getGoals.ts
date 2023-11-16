import getAuths from "./getAuths.js";
import { api } from "./index.js";
import { type Goal } from "./types/goal.js";
import { type GoalExtended } from "./types/goalExtended.js";

export default async function getGoals(): Promise<GoalExtended[]> {
  const auths = getAuths();
  const users = Object.keys(auths);

  const goals = await Promise.all(
    users.map(async (user) => {
      const { data } = await api<Goal[]>({
        user,
        endpoint: "goals",
      });

      if (data instanceof Array) {
        return data.map((g) => ({
          ...g,
          url: `https://www.beeminder.com/${user}/${g.slug}`,
        }));
      }

      throw new Error(`Failed to get goals for ${user}`);
    })
  );

  return goals.flat();
}
