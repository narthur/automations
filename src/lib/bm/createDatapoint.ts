import axios from "axios";

type Data = {
  value: number;
  comment?: string;
  daystamp?: string;
  requestid?: string;
};

type ServerError = {
  response: {
    status: number;
  }
}

function isServerError(err: unknown): err is ServerError {
  if (typeof err !== "object" || err === null) {
    return false;
  }

  return typeof (err as ServerError).response === "object";
}

export default async function createDatapoint(slug: string, data: Data) {
  const url = `https://www.beeminder.com/api/v1/users/${process.env.USERNAME}/goals/gross/datapoints.json`;
  const options = {
    auth_token: process.env.AUTH_TOKEN,
    ...data,
  };

  try {
    await axios.post(url, options);
  } catch (e: unknown) {  
    if (isServerError(e) && e.response.status === 422) {
      return;
    }

    throw new Error(`Failed to create datapoint for ${slug}`)
  }
}
