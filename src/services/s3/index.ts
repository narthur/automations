import {
  GetObjectCommand,
  ListObjectsV2Command,
  S3Client,
  type S3ClientConfig,
} from "@aws-sdk/client-s3";

import env from "../../lib/env.js";

export interface S3File {
  key: string;
  content: Uint8Array;
}

export class S3Service {
  private client: S3Client;
  private bucket: string;

  constructor(bucket?: string, config?: S3ClientConfig) {
    this.bucket = bucket || env("S3_BUCKET_NAME") || "";
    this.client = new S3Client({
      endpoint: env("S3_ENDPOINT"),
      credentials: {
        accessKeyId: env("S3_ACCESS_KEY_ID") || "",
        secretAccessKey: env("S3_SECRET_ACCESS_KEY") || "",
      },
      region: env("S3_REGION") || "us-west-000",
      forcePathStyle: true,
      ...config,
    });
  }

  async listFiles(extension?: string): Promise<string[]> {
    const command = new ListObjectsV2Command({
      Bucket: this.bucket,
    });

    try {
      const response = await this.client.send(command);
      const files = response.Contents?.map((file) => file.Key).filter((key): key is string => !!key) || [];

      if (extension) {
        return files.filter((key) => key.toLowerCase().endsWith(extension));
      }

      return files;
    } catch (error) {
      console.error("Failed to list files:", error);
      return [];
    }
  }

  async getFile(key: string): Promise<S3File | null> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    try {
      const response = await this.client.send(command);
      if (!response.Body) {
        return null;
      }

      const buffer = await response.Body.transformToByteArray();
      return {
        key,
        content: buffer,
      };
    } catch (error) {
      console.error(`Failed to download ${key}:`, error);
      return null;
    }
  }

  async getFiles(keys: string[]): Promise<S3File[]> {
    const files = await Promise.all(keys.map((key) => this.getFile(key)));
    return files.filter((file): file is S3File => file !== null);
  }
}
