import { update } from "src/goals/dynadone.js";

export async function GET() {
  return await update()
    .then(() => new Response("OK"))
    .catch(
      (e) =>
        new Response(JSON.stringify(e, null, 2), {
          status: 500,
        })
    );
}
