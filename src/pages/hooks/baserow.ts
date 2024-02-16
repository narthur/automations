import type { APIContext } from "astro";

export function POST(context: APIContext) {
  console.log({ context });

  return new Response("OK");
}
