import makeDaystamp from "src/lib/makeDaystamp.js";

import createDatapoint from "./createDatapoint.js";
import { type DatapointInput } from "./types/datapointInput.js";

export default function createBinaryDatapoint(
  user: string,
  slug: string,
  data: Omit<DatapointInput, "requestid"> & { value: 0 | 1 }
) {
  const daystamp = data.daystamp || makeDaystamp();

  return createDatapoint(user, slug, {
    ...data,
    daystamp,
    requestid: `binary-${daystamp}-${data.value}`,
  });
}
