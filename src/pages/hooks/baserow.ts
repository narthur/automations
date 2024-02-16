import { update } from "../../goals/gross";

export async function POST() {
  await update();

  return new Response("OK");
}
