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
  });
}
