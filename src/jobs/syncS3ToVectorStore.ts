import { GetObjectCommand, ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3";
import { toFile } from "openai/uploads.mjs";

import env from "../lib/env.js";
import replaceVectorStore from "../services/openai/replaceVectorStore.js";

const BATCH_SIZE = 20; // OpenAI's recommended batch size

async function downloadS3File(client: S3Client, bucket: string, key: string) {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  const response = await client.send(command);
  if (!response.Body) {
    throw new Error(`No body in response for ${key}`);
  }

  const buffer = await response.Body.transformToByteArray();
  return toFile(buffer, key);
}

async function* batchFiles(files: { Key: string }[], batchSize: number) {
  for (let i = 0; i < files.length; i += batchSize) {
    yield files.slice(i, i + batchSize);
  }
}

export async function syncS3ToVectorStore() {
  console.log("Starting S3 to vector store sync");
  
  const bucketName = env("S3_BUCKET_NAME");
  const storeName = env("OPENAI_VECTOR_STORE_NAME");
  
  if (!bucketName || !storeName) {
    throw new Error("Missing required environment variables");
  }

  const s3Client = new S3Client({
    endpoint: env("S3_ENDPOINT"),
    credentials: {
      accessKeyId: env("S3_ACCESS_KEY_ID") || "",
      secretAccessKey: env("S3_SECRET_ACCESS_KEY") || "",
    },
    region: env("S3_REGION") || "us-west-000",
    forcePathStyle: true,
  });
  
  // List all objects in the bucket
  const listCommand = new ListObjectsV2Command({
    Bucket: bucketName,
  });

  const response = await s3Client.send(listCommand);
  if (!response.Contents) {
    console.log("No files found in bucket");
    return;
  }

  console.log(`Found ${response.Contents.length} files to sync`);

  // Process files in batches
  let batchNumber = 0;
  for await (const batch of batchFiles(response.Contents, BATCH_SIZE)) {
    batchNumber++;
    console.log(`Processing batch ${batchNumber}/${Math.ceil(response.Contents.length / BATCH_SIZE)}`);
    
    // Download batch of files
    const files = await Promise.all(
      batch.map(async (object) => {
        if (!object.Key) {
          throw new Error("Object key is undefined");
        }
        return downloadS3File(s3Client, bucketName, object.Key);
      })
    );

    // Update vector store with this batch
    await replaceVectorStore(storeName, files);
    
    console.log(`Completed batch ${batchNumber}`);
  }
  
  console.log(`Successfully synced ${response.Contents.length} files to vector store`);
}
