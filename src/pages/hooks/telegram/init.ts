import type { APIContext } from "astro";
import getFullUrl from "src/lib/getFullUrl";
import { TELEGRAM_WEBHOOK_TOKEN } from "src/secrets";
import { setWebhook } from "src/services/telegram";

export async function GET({ request }: APIContext) {
  return await setWebhook({
    url: getFullUrl(request, "bot/hook"),
    secret_token: TELEGRAM_WEBHOOK_TOKEN.value(),
  })
    .then(() => new Response("OK"))
    .catch(
      (e) =>
        new Response(JSON.stringify(e, null, 2), {
          status: 500,
        })
    );
}
