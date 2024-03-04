import * as bm from "../../jobs/goals/bm";
import * as gross from "../../jobs/goals/gross";

export async function POST() {
  await gross.update();
  await bm.update();

  return new Response("OK");
}
