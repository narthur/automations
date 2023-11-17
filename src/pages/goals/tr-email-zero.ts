import type { APIContext } from "astro";
import createBinaryDatapoint from "src/services/beeminder/createBinaryDatapoint";
import { z } from "zod";

export async function POST({ request }: APIContext) {
  const json: unknown = await request.json();
  const { count } = z
    .object({
      count: z.number(),
    })
    .parse(json);

  return await createBinaryDatapoint("narthur", "tr-email-zero", {
    value: count > 0 ? 0 : 1,
    comment: `Emails: ${count} (${new Date().toLocaleString()})`,
  })
    .then(() => new Response("OK"))
    .catch(
      (e) =>
        new Response(JSON.stringify(e, null, 2), {
          status: 500,
        })
    );
}
