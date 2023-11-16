import type { APIContext } from "astro";
import createBinaryDatapoint from "src/services/beeminder/createBinaryDatapoint";
import { z } from "zod";

export async function POST(context: APIContext) {
  const data = z
    .object({
      count: z.number(),
    })
    .parse(context.request.body);

  return await createBinaryDatapoint("narthur", "email-zero", {
    value: data.count > 0 ? 0 : 1,
    comment: `Emails: ${data.count} (${new Date().toLocaleString()})`,
  })
    .then(() => new Response("OK"))
    .catch(
      (e) =>
        new Response(JSON.stringify(e, null, 2), {
          status: 500,
        })
    );
}
