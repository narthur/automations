import { describe, expect, it, vi } from "vitest";
import jobCommand from "./job";
import { syncS3ToVectorStore } from "../jobs/syncS3ToVectorStore";

vi.mock("../jobs/syncS3ToVectorStore", () => ({
  syncS3ToVectorStore: vi.fn(),
}));

describe("job", () => {
  it("should list available jobs when no job ID is provided", async () => {
    const result = await jobCommand.action("/job");
    expect(result[0]).toContain("Available jobs:");
    expect(result[0]).toContain("sync-s3");
  });

  it("should list available jobs when invalid job ID is provided", async () => {
    const result = await jobCommand.action("/job invalid-id");
    expect(result[0]).toContain("Invalid job ID: invalid-id");
    expect(result[0]).toContain("Available jobs:");
  });

  it("should run sync-s3 job", async () => {
    vi.mocked(syncS3ToVectorStore).mockResolvedValueOnce();
    const result = await jobCommand.action("/job sync-s3");
    expect(result[0]).toContain("Successfully ran job");
    expect(syncS3ToVectorStore).toHaveBeenCalled();
  });

  it("should handle job errors", async () => {
    vi.mocked(syncS3ToVectorStore).mockRejectedValueOnce(new Error("Sync failed"));
    const result = await jobCommand.action("/job sync-s3");
    expect(result[0]).toContain("Failed to run job");
    expect(result[0]).toContain("Sync failed");
  });
});
