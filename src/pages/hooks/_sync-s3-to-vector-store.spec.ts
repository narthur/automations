import { describe, expect, it, vi } from "vitest";
import { POST } from "../jobs/sync-s3-to-vector-store";
import { syncS3ToVectorStore } from "../../jobs/syncS3ToVectorStore";
import env from "../../lib/env";

vi.mock("../../jobs/syncS3ToVectorStore", () => ({
  syncS3ToVectorStore: vi.fn(),
}));

vi.mock("../../lib/env", () => ({
  default: vi.fn(),
}));

describe("sync-s3-to-vector-store", () => {
  it("should require authentication", async () => {
    vi.mocked(env).mockReturnValue("correct-token");

    const response = await POST({
      request: new Request("http://example.com", {
        method: "POST",
        headers: {
          Authorization: "Bearer wrong-token",
        },
      }),
    } as any);

    expect(response.status).toBe(401);
    expect(syncS3ToVectorStore).not.toHaveBeenCalled();
  });

  it("should trigger sync when authenticated", async () => {
    const token = "correct-token";
    vi.mocked(env).mockImplementation((key) =>
      key === "TELEGRAM_WEBHOOK_TOKEN" ? token : undefined
    );

    const response = await POST({
      request: new Request("http://example.com", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    } as any);

    expect(response.status).toBe(200);
    expect(syncS3ToVectorStore).toHaveBeenCalled();
  });

  it("should handle sync errors", async () => {
    const token = "correct-token";
    vi.mocked(env).mockImplementation((key) =>
      key === "TELEGRAM_WEBHOOK_TOKEN" ? token : undefined
    );
    vi.mocked(syncS3ToVectorStore).mockRejectedValueOnce(new Error("Sync failed"));

    const response = await POST({
      request: new Request("http://example.com", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    } as any);

    expect(response.status).toBe(500);
    const text = await response.text();
    expect(text).toContain("Sync failed");
  });
});
