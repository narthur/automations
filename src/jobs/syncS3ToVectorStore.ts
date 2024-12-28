import { GetObjectCommand, ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3";
import { toFile } from "openai/uploads.mjs";
import replaceVectorStore from "../services/openai/replaceVectorStore.js";
import env from "../lib/env.js";

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
    forcePathStyle: true, // Required for B2
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

  // Download all files
  const files = await Promise.all(
    response.Contents.map(async (object) => {
      if (!object.Key) {
        throw new Error("Object key is undefined");
      }
      return downloadS3File(s3Client, bucketName, object.Key);
    })
  );

  // Replace vector store with new files
  await replaceVectorStore(storeName, files);
  
  console.log(`Successfully synced ${files.length} files to vector store`);
}
