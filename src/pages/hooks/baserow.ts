import * as bm from "../../goals/bm";
import * as gross from "../../goals/gross";

export async function POST() {
  await gross.update();
  await bm.update();

  return new Response("OK");
}
