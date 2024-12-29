import { toFile, type Uploadable } from "openai/uploads.mjs";

import env from "../lib/env.js";
import { S3Service } from "../services/s3/index.js";
import replaceVectorStore from "../services/openai/replaceVectorStore.js";

const BATCH_SIZE = 20; // OpenAI's recommended batch size
const MAX_RETRIES = 3;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB limit

async function* batchArray<T>(items: T[], batchSize: number) {
  for (let i = 0; i < items.length; i += batchSize) {
    yield items.slice(i, i + batchSize);
  }
}

async function processBatchWithRetry(
  storeName: string,
  files: Uploadable[],
  retries = MAX_RETRIES
): Promise<void> {
  let lastError: Error | undefined;
  for (let attempt = 0; attempt < retries + 1; attempt++) {
    try {
      await replaceVectorStore(storeName, files);
      return;
    } catch (error) {
      lastError = error as Error;
      if (attempt < retries) {
        console.warn(
          `Batch upload failed, retrying... (${retries - attempt} attempts left)`
        );
        await new Promise((resolve) => setTimeout(resolve, 100)); // Reduced wait time for tests
      }
    }
  }
  throw lastError;
}

export async function syncS3ToVectorStore() {
  const startTime = Date.now();
  console.log("Starting S3 to vector store sync");

  const storeName = env("OPENAI_VECTOR_STORE_NAME");
  if (!storeName) {
    throw new Error("Missing required environment variables");
  }

  const s3 = new S3Service();
  const files = await s3.listFiles(".md");

  if (files.length === 0) {
    console.log("No files found in bucket");
    return;
  }

  console.log(`Found ${files.length} markdown files to sync`);

  // Track statistics
  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  // Process files in batches
  let batchNumber = 0;
  for await (const batchKeys of batchArray(files, BATCH_SIZE)) {
    batchNumber++;
    console.log(
      `Processing batch ${batchNumber}/${Math.ceil(files.length / BATCH_SIZE)}`
    );

    try {
      const batchFiles = await s3.getFiles(batchKeys);
      const validFiles = await Promise.all(
        batchFiles
          .filter((file) => file.content.length <= MAX_FILE_SIZE)
          .map((file) => toFile(file.content, file.key))
      );

      successCount += validFiles.length;
      skipCount += batchKeys.length - validFiles.length;

      if (validFiles.length > 0) {
        await processBatchWithRetry(storeName, validFiles);
      }

      console.log(`Completed batch ${batchNumber}`);
    } catch (error) {
      console.error(`Failed to process batch ${batchNumber}:`, error);
      errorCount += batchKeys.length;
    }
  }

  const duration = (Date.now() - startTime) / 1000;
  console.log(
    `Sync completed in ${duration}s:`,
    `\n- Successfully processed: ${successCount} files`,
    `\n- Skipped: ${skipCount} files`,
    `\n- Errors: ${errorCount} files`
  );
}
