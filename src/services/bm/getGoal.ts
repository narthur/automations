import axios from "axios";
import getBmToken from "./getBmToken";
import { Goal } from "../../types/beeminder";

function isGoal(obj: unknown): obj is Goal {
  // This is a type guard. It checks if the object is a Goal.

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

  if (!t) {
    throw new Error(`No Beeminder token for ${user}`);
  }

  const url = `https://www.beeminder.com/api/v1/users/${user}/goals/${slug}.json?auth_token=${t}&datapoints=true`;
  const response = await axios.get(url).catch((error) => {
    console.error("Error fetching goal");
    console.error("URL:", url);
    console.error(error);
    throw error;
  });

  if (isGoal(response.data)) {
    return response.data;
  }

  throw new Error(`Failed to get goal for ${slug}`);
}
