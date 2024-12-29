import {
  GetObjectCommand,
  ListObjectsV2Command,
  S3Client,
} from "@aws-sdk/client-s3";
import { beforeEach, describe, expect, it, vi } from "vitest";

import env from "../lib/env";
import replaceVectorStore from "../services/openai/replaceVectorStore";
import { syncS3ToVectorStore } from "./syncS3ToVectorStore";

// Mock environment variables
vi.mock("../lib/env", () => ({
  default: vi.fn((key: string) => {
    const vars: Record<string, string> = {
      S3_BUCKET_NAME: "test-bucket",
      S3_ENDPOINT: "test.endpoint.com",
      S3_ACCESS_KEY_ID: "test-key",
      S3_SECRET_ACCESS_KEY: "test-secret",
      S3_REGION: "test-region",
      OPENAI_VECTOR_STORE_NAME: "test-store",
    };
    return vars[key];
  }),
}));

// Mock S3 client
vi.mock("@aws-sdk/client-s3", () => {
  const mockSend = vi.fn();
  return {
    S3Client: vi.fn(() => ({
      send: mockSend,
    })),
    ListObjectsV2Command: vi.fn(),
    GetObjectCommand: vi.fn(),
  };
});

// Mock replaceVectorStore
vi.mock("../services/openai/replaceVectorStore", () => ({
  default: vi.fn(),
}));

describe("syncS3ToVectorStore", () => {
  const mockFiles = [{ Key: "file1.txt" }, { Key: "file2.txt" }];

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock successful list response
    vi.mocked(S3Client).mockImplementation(
      () =>
        ({
          send: vi.fn().mockImplementation((command) => {
            if (command instanceof ListObjectsV2Command) {
              return Promise.resolve({ Contents: mockFiles });
            }
            if (command instanceof GetObjectCommand) {
              return Promise.resolve({
                Body: {
                  transformToByteArray: () =>
                    Promise.resolve(new Uint8Array([1, 2, 3])),
                },
              });
            }
            throw new Error("Unexpected command");
          }),
        } as any)
    );
  });

  it("should sync files from S3 to vector store", async () => {
    await syncS3ToVectorStore();

    // Verify S3 client was configured correctly
    expect(S3Client).toHaveBeenCalledWith({
      endpoint: "test.endpoint.com",
      credentials: {
        accessKeyId: "test-key",
        secretAccessKey: "test-secret",
      },
      region: "test-region",
      forcePathStyle: true,
    });

    // Verify list command was called
    expect(ListObjectsV2Command).toHaveBeenCalledWith({
      Bucket: "test-bucket",
    });

    // Verify get commands were called for each file
    mockFiles.forEach((file) => {
      expect(GetObjectCommand).toHaveBeenCalledWith({
        Bucket: "test-bucket",
        Key: file.Key,
      });
    });

    // Verify vector store was updated
    expect(replaceVectorStore).toHaveBeenCalledWith(
      "test-store",
      expect.arrayContaining([
        expect.any(Object), // File objects
        expect.any(Object),
      ])
    );
  });

  it("should handle empty bucket", async () => {
    // Mock empty bucket response
    (S3Client as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      () => ({
        send: vi.fn().mockResolvedValue({ Contents: null }),
      })
    );

    await syncS3ToVectorStore();

    // Verify vector store was not updated
    expect(replaceVectorStore).not.toHaveBeenCalled();
  });

  it("should throw error if environment variables are missing", async () => {
    // Mock missing environment variables
    vi.mocked(env).mockImplementation(() => undefined);

    await expect(syncS3ToVectorStore()).rejects.toThrow(
      "Missing required environment variables"
    );
  });
});
