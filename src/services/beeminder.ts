import axios from "axios";
import { DatapointInput, Goal } from "./beeminder.types.js";
import { BM_AUTHS } from "../secrets.js";

function parse(auth: string): [string, string] {
  const [u, t] = auth.split(":");
  return [u, t];
}

function getToken(user: string): string | undefined {
  const rawAuths = BM_AUTHS.value();
  const entries = rawAuths.split(",").map(parse);
  const auths = Object.fromEntries(entries);

  return auths[user];
}

export async function createDatapoint(
  user: string,
  slug: string,
  data: DatapointInput
) {
  const url = `https://www.beeminder.com/api/v1/users/${user}/goals/${slug}/datapoints.json`;

  await axios.post(
    url,
    {
      auth_token: getToken(user),
      ...data,
    },
    {
      validateStatus: (status: number) => {
        // Beeminder returns a 422 when the datapoint already exists.
        return (status >= 200 && status < 300) || status === 422;
      },
    }
  );
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

export type GoalExtended = Goal & {
  url: string;
};

export async function getGoals(): Promise<GoalExtended[]> {
  const rawAuths = BM_AUTHS.value();
  const entries = rawAuths.split(",").map(parse);

  const goals = await Promise.all(
    entries.map(async ([user, token]) => {
      const url = `https://www.beeminder.com/api/v1/users/${user}/goals.json?auth_token=${token}`;
      console.info("Fetching goals for", user, "from", url);
      const response = await axios.get(url).catch((error) => {
        console.error("Error fetching goals");
        console.error("URL:", url);
        console.error(error);
        throw error;
      });

      const data = response.data as unknown[];

      if (data.every(isGoal)) {
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
