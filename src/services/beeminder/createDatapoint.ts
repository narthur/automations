import { AxiosError } from "axios";

import { api } from "./index.js";
import { DatapointInput } from "./types/datapointInput.js";

export default async function createDatapoint(
  user: string,
  slug: string,
  data: DatapointInput
) {
  await api({
    user,
    endpoint: `goals/${slug}/datapoints`,
    method: "POST",
    data,
  }).catch((e: AxiosError) => {
    if (
      e.response &&
      e.response.status === 422 &&
      JSON.stringify(e.response).toLowerCase().includes("duplicate")
    ) {
      console.info("Ignoring duplicate datapoint error");
      return;
    }

    throw e;
  });
}
