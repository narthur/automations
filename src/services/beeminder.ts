import axios from "axios";
import { DatapointInput, Goal, ServerError } from "./beeminder.types";
import { bmAuths } from "../secrets";

function parse(auth: string): [string, string] {
  const [u, t] = auth.split(":");
  return [u, t];
}

function getToken(user: string): string | undefined {
  const rawAuths = bmAuths.value();
  const entries = rawAuths.split(",").map(parse);
  const auths = Object.fromEntries(entries);

  return auths[user];
}

function isServerError(err: unknown): err is ServerError {
  if (typeof err !== "object" || err === null) {
    return false;
  }

  return typeof (err as ServerError).response === "object";
}

export async function createDatapoint(
  user: string,
  slug: string,
  data: DatapointInput
) {
  const url = `https://www.beeminder.com/api/v1/users/${user}/goals/${slug}/datapoints.json`;
  const options = {
    auth_token: getToken(user),
    ...data,
  };

  try {
    await axios.post(url, options);
  } catch (e: unknown) {
    if (isServerError(e) && e.response.status === 422) {
      return;
    }

    console.error(e);
    throw new Error(`Failed to create datapoint for ${slug}`);
  }
}

function isGoal(obj: unknown): obj is Goal {
  if (typeof obj !== "object") return false;
  if (obj === null) return false;
  return typeof (obj as Goal).slug === "string";
}

export async function getGoal(user: string, slug: string): Promise<Goal> {
  const t = getToken(user);

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

export async function getGoals(): Promise<Goal[]> {
  const rawAuths = bmAuths.value();
  const entries = rawAuths.split(",").map(parse);
  const auths = Object.fromEntries(entries);

  const goals = await Promise.all(
    Object.entries(auths).map(async ([user, token]) => {
      const url = `https://www.beeminder.com/api/v1/users/${user}/goals.json?auth_token=${token}&datapoints=true`;
      const response = await axios.get(url).catch((error) => {
        console.error("Error fetching goals");
        console.error("URL:", url);
        console.error(error);
        throw error;
      });

      const data = response.data as unknown[];

      if (data.every(isGoal)) {
        return data;
      }

      throw new Error(`Failed to get goals for ${user}`);
    })
  );

  return goals.flat();
}
