import type { APIContext } from "astro";
import handleBotRequest from "src/lib/handleBotRequest";

export function POST(context: APIContext) {
  return handleBotRequest(context);
}
