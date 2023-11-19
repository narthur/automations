import type { APIContext } from "astro";
import env from "src/lib/env";
import getFullUrl from "src/lib/getFullUrl";
import { setWebhook } from "src/services/telegram";

export async function GET({ request }: APIContext) {
  const url = getFullUrl(request, "hooks/telegram");

  return await setWebhook({
    url,
    secret_token: env("TELEGRAM_WEBHOOK_TOKEN"),
  })
    .then(() => new Response(`Telegram webhook set to ${url}`))
    .catch(
      (e) =>
        new Response(JSON.stringify(e, null, 2), {
          status: 500,
        })
    );
}
