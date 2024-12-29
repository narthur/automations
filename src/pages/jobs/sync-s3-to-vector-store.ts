import type { APIContext } from "astro";
import { syncS3ToVectorStore } from "../../jobs/syncS3ToVectorStore.js";
import env from "../../lib/env.js";

export async function POST({ request }: APIContext) {
  // Check for auth token
  const authHeader = request.headers.get("Authorization");
  const token = authHeader?.replace("Bearer ", "");
  if (token !== env("TELEGRAM_WEBHOOK_TOKEN")) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    await syncS3ToVectorStore();
    return new Response("Sync completed successfully", { status: 200 });
  } catch (error) {
    console.error("Failed to sync S3 to vector store:", error);
    return new Response(
      `Failed to sync: ${error instanceof Error ? error.message : "Unknown error"}`,
      { status: 500 }
    );
  }
}
