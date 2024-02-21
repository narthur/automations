import { update } from "src/goals/techtainment.js";

export async function GET() {
  return await update()
    .then(() => new Response("OK"))
    .catch((e) => {
      console.error(e);
      return new Response(JSON.stringify(e, null, 2), {
        status: 500,
      });
    });
}
