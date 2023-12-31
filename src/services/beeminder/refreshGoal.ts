import { api } from "./index.js";

// "This is an asynchronous operation, so this endpoint simply
// returns true if the goal was queued and false if not. It is
// up to you to watch for an updated graph image."
// SOURCE: https://api.beeminder.com/#refresh
export default async function refreshGoal(
  user: string,
  slug: string
): Promise<boolean> {
  const response = await api<boolean>({
    user,
    endpoint: `goals/${slug}/refresh_graph`,
  });

  if (typeof response.data !== "boolean") {
    throw new Error(`Failed to refresh goal for ${slug}`);
  }

  return response.data;
}
