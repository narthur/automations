import { api } from "./index.js";
import type { Datapoint } from "./types/datapoint.js";

// https://api.beeminder.com/#dataall
export default async function getDatapoints(
  user: string,
  goal: string,
  options: {
    sort?: string;
    count?: number;
    page?: number;
    per?: number;
  } = {}
): Promise<Array<Datapoint>> {
  const response = await api<Array<Datapoint>>({
    user,
    endpoint: `goals/${goal}/datapoints`,
    params: options,
  });

  if (!Array.isArray(response.data)) {
    throw new Error(`Failed to get datapoints for ${goal}`);
  }

  return response.data;
}
