import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { S3Service } from "../services/s3/index.js";
import { syncS3ToVectorStore } from "./syncS3ToVectorStore";
import replaceVectorStore from "../services/openai/replaceVectorStore";
import env from "../lib/env";

vi.mock("../services/s3/index.js", () => ({
  S3Service: vi.fn(),
}));

vi.mock("../services/openai/replaceVectorStore", () => ({
  default: vi.fn(),
}));

vi.mock("../lib/env", () => ({
  default: vi.fn(),
}));

describe("syncS3ToVectorStore", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.mocked(env).mockImplementation((key: string) => {
      const vars: Record<string, string> = {
        OPENAI_VECTOR_STORE_NAME: "test-store",
        S3_BUCKET_NAME: "test-bucket",
        S3_ENDPOINT: "test.endpoint.com",
        S3_ACCESS_KEY_ID: "test-key",
        S3_SECRET_ACCESS_KEY: "test-secret",
        S3_REGION: "test-region",
      };
      return vars[key];
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should sync files from S3 to vector store", async () => {
    const mockFiles = ["file1.md", "file2.md"];
    const mockContent = new Uint8Array([1, 2, 3]);

    vi.mocked(S3Service).mockImplementation(
      () =>
        ({
          listFiles: vi.fn().mockResolvedValue(mockFiles),
          getFiles: vi.fn().mockResolvedValue([
            { key: "file1.md", content: mockContent },
            { key: "file2.md", content: mockContent },
          ]),
        } as any)
    );

    await syncS3ToVectorStore();

    expect(replaceVectorStore).toHaveBeenCalledWith(
      "test-store",
      expect.arrayContaining([expect.any(Object), expect.any(Object)])
    );
  });

  it("should handle empty bucket", async () => {
    vi.mocked(S3Service).mockImplementation(
      () =>
        ({
          listFiles: vi.fn().mockResolvedValue([]),
        } as any)
    );

    await syncS3ToVectorStore();

    expect(replaceVectorStore).not.toHaveBeenCalled();
  });

  it("should throw error if environment variables are missing", async () => {
    vi.mocked(env).mockImplementation(() => undefined);

    await expect(syncS3ToVectorStore()).rejects.toThrow(
      "Missing required environment variables"
    );
  });

  it("should process files in batches", async () => {
    const mockFiles = Array.from({ length: 25 }, (_, i) => `file${i + 1}.md`);
    const mockContent = new Uint8Array([1, 2, 3]);

    vi.mocked(S3Service).mockImplementation(
      () =>
        ({
          listFiles: vi.fn().mockResolvedValue(mockFiles),
          getFiles: vi
            .fn()
            .mockImplementation((keys: string[]) =>
              Promise.resolve(
                keys.map((key) => ({ key, content: mockContent }))
              )
            ),
        } as any)
    );

    await syncS3ToVectorStore();

    expect(replaceVectorStore).toHaveBeenCalledTimes(2);
    expect(replaceVectorStore).toHaveBeenNthCalledWith(
      1,
      "test-store",
      expect.arrayContaining(Array(20).fill(expect.any(Object)))
    );
    expect(replaceVectorStore).toHaveBeenNthCalledWith(
      2,
      "test-store",
      expect.arrayContaining(Array(5).fill(expect.any(Object)))
    );
  });

  it("should skip files that are too large", async () => {
    const largeBuffer = new Uint8Array(11 * 1024 * 1024); // 11MB
    const smallBuffer = new Uint8Array([1, 2, 3]); // Small file

    vi.mocked(S3Service).mockImplementation(
      () =>
        ({
          listFiles: vi.fn().mockResolvedValue(["large.md", "small.md"]),
          getFiles: vi.fn().mockResolvedValue([
            { key: "large.md", content: largeBuffer },
            { key: "small.md", content: smallBuffer },
          ]),
        } as any)
    );

    await syncS3ToVectorStore();

    expect(replaceVectorStore).toHaveBeenCalledTimes(1);
    expect(replaceVectorStore).toHaveBeenCalledWith(
      "test-store",
      expect.arrayContaining([expect.any(Object)])
    );
  });

  it.only("should retry failed uploads", async () => {
    // Mock S3Service
    const s3Mock = {
      listFiles: vi.fn().mockResolvedValue(["file1.md"]),
      getFiles: vi
        .fn()
        .mockResolvedValue([
          { key: "file1.md", content: new Uint8Array([1, 2, 3]) },
        ]),
    };
    vi.mocked(S3Service).mockImplementation(() => s3Mock as any);

    // Mock replaceVectorStore to fail twice then succeed
    const replaceVectorStoreMock = vi.mocked(replaceVectorStore);
    replaceVectorStoreMock
      .mockRejectedValueOnce(new Error("Upload failed"))
      .mockRejectedValueOnce(new Error("Upload failed"))
      .mockResolvedValueOnce(undefined);

    // Run sync and wait for completion
    await syncS3ToVectorStore();

    // Use vi.waitFor to wait for the condition to be met
    await vi.waitFor(() => {
      expect(replaceVectorStoreMock).toHaveBeenCalledTimes(3);
      expect(replaceVectorStoreMock).toHaveBeenCalledWith(
        "test-store",
        expect.arrayContaining([expect.any(Object)])
      );
    });
  });

  it("should track sync duration and statistics", async () => {
    const consoleSpy = vi.spyOn(console, "log");

    // Mock S3Service
    const s3Mock = {
      listFiles: vi.fn().mockResolvedValue(["file1.md"]),
      getFiles: vi
        .fn()
        .mockResolvedValue([
          { key: "file1.md", content: new Uint8Array([1, 2, 3]) },
        ]),
    };
    vi.mocked(S3Service).mockImplementation(() => s3Mock as any);

    // Mock replaceVectorStore to succeed immediately
    vi.mocked(replaceVectorStore).mockResolvedValueOnce(undefined);

    // Run sync and wait for completion
    await syncS3ToVectorStore();

    // Use vi.waitFor to wait for the condition to be met
    await vi.waitFor(() => {
      const completionLog = consoleSpy.mock.calls.find((call) =>
        call[0]?.includes?.("Sync completed in")
      );
      expect(completionLog).toBeDefined();
      expect(completionLog?.[0]).toContain("Successfully processed: 1 files");
      expect(completionLog?.[0]).toContain("Skipped: 0 files");
      expect(completionLog?.[0]).toContain("Errors: 0 files");
    });
  });
});
