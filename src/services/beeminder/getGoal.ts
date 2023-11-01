import { api } from "./index.js";
import isGoal from "./isGoal.js";
import { Goal } from "./types/goal.js";

export default async function getGoal(
  user: string,
  slug: string
): Promise<Goal> {
  const response = await api<Goal>({
    user,
    endpoint: `goals/${slug}`,
    params: {
      datapoints: true,
    },
  });

  if (isGoal(response.data)) {
    return response.data;
  }

  throw new Error(`Failed to get goal for ${slug}`);
}
