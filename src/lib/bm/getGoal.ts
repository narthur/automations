import axios from "axios";
import getBmToken from "./getBmToken";

function isGoal(obj: unknown): obj is Goal {
  if (typeof obj !== "object" || obj === null) {
    return false;
  }

  return typeof (obj as Goal).slug === "string";
}

export default async function getGoal(
  user: string,
  slug: string
): Promise<Goal> {
  const t = getBmToken(user);
  const url = `https://www.beeminder.com/api/v1/users/${user}/goals/${slug}.json?auth_token=${t}`;
  const response = await axios.get(url);

  if (isGoal(response.data)) {
    return response.data;
  }

  throw new Error(`Failed to get goal for ${slug}`);
}
