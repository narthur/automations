import { S3Client } from "@aws-sdk/client-s3";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { S3Service } from "./index";

vi.mock("@aws-sdk/client-s3", () => ({
  S3Client: vi.fn(),
  ListObjectsV2Command: vi.fn(),
  GetObjectCommand: vi.fn(),
}));

vi.mock("../../lib/env", () => ({
  default: vi.fn((key: string) => {
    const vars: Record<string, string> = {
      S3_BUCKET_NAME: "test-bucket",
      S3_ENDPOINT: "test.endpoint.com",
      S3_ACCESS_KEY_ID: "test-key",
      S3_SECRET_ACCESS_KEY: "test-secret",
      S3_REGION: "test-region",
    };
    return vars[key];
  }),
}));

describe("S3Service", () => {
  let s3Service: S3Service;
  let mockSend: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockSend = vi.fn();
    vi.mocked(S3Client).mockImplementation(() => ({
      send: mockSend,
      config: {
        requestHandler: {
          metadata: {},
          abortSignal: undefined,
          handlerProtocol: 'h2'
        },
        apiVersion: '2006-03-01',
        disableHostPrefix: false,
        logger: {},
        region: 'us-west-000',
        serviceId: 's3',
        urlParser: new URL('http://localhost'),
        utf8Decoder: new TextDecoder(),
        utf8Encoder: new TextEncoder()
      },
      destroy: vi.fn(),
      middlewareStack: {
        add: vi.fn(),
        remove: vi.fn(),
        use: vi.fn(),
        resolve: vi.fn(),
        addRelativeTo: vi.fn(),
        removeByTag: vi.fn(),
        concat: vi.fn(),
        identify: vi.fn(),
        clone: vi.fn(),
        filter: vi.fn(),
        removeMiddleware: vi.fn()
      },
    } as any));
    s3Service = new S3Service();
  });

  it("should list files", async () => {
    const mockFiles = [{ Key: "file1.md" }, { Key: "file2.txt" }];
    mockSend.mockResolvedValueOnce({ Contents: mockFiles });

    const files = await s3Service.listFiles();
    expect(files).toEqual(["file1.md", "file2.txt"]);
  });

  it("should filter files by extension", async () => {
    const mockFiles = [{ Key: "file1.md" }, { Key: "file2.txt" }];
    mockSend.mockResolvedValueOnce({ Contents: mockFiles });

    const files = await s3Service.listFiles(".md");
    expect(files).toEqual(["file1.md"]);
  });

  it("should get file content", async () => {
    const mockContent = new Uint8Array([1, 2, 3]);
    mockSend.mockResolvedValueOnce({
      Body: {
        transformToByteArray: () => Promise.resolve(mockContent),
      },
    });

    const file = await s3Service.getFile("test.md");
    expect(file).toEqual({
      key: "test.md",
      content: mockContent,
    });
  });

  it("should handle missing files", async () => {
    mockSend.mockRejectedValueOnce(new Error("File not found"));

    const file = await s3Service.getFile("missing.md");
    expect(file).toBeNull();
  });

  it("should get multiple files", async () => {
    const mockContent = new Uint8Array([1, 2, 3]);
    mockSend.mockResolvedValueOnce({
      Body: {
        transformToByteArray: () => Promise.resolve(mockContent),
      },
    }).mockResolvedValueOnce({
      Body: {
        transformToByteArray: () => Promise.resolve(mockContent),
      },
    });

    const files = await s3Service.getFiles(["file1.md", "file2.md"]);
    expect(files).toEqual([
      { key: "file1.md", content: mockContent },
      { key: "file2.md", content: mockContent },
    ]);
  });
});
