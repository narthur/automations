import type { APIContext } from "astro";
import * as billable from "src/goals/billable.js";
import createSummaryTask from "src/lib/createSummaryTask.js";
import event from "src/services/toggl/schemas/event";
import validateSignature from "src/services/toggl/validateSignature.js";
import { z } from "zod";

import * as gross from "../../goals/gross.js";
import * as techtainment from "../../goals/techtainment.js";

export async function POST({ request }: APIContext) {
  const message = await request.text();
  const signature = request.headers.get("x-webhook-signature-256") || "";

  if (!validateSignature(message, signature)) {
    return new Response("Unauthorized", { status: 401 });
  }

  const json: unknown = JSON.parse(message);

  const validationResult = z
    .object({
      validation_code: z.string(),
    })
    .safeParse(json);

  if (validationResult.success) {
    // https://developers.track.toggl.com/docs/webhooks_start/url_endpoint_validation/index.html
    return new Response(
      JSON.stringify(
        {
          validation_code: validationResult.data.validation_code,
        },
        null,
        2
      )
    );
  }

  void billable.update();
  void gross.update();
  void techtainment.update();

  const eventResult = event.safeParse(json);

  if (eventResult.success && eventResult.data.metadata.model === "time_entry") {
    void createSummaryTask(eventResult.data);
  }

  return new Response("OK");
}
