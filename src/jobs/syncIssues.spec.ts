import baserow from "src/services/baserow";
import { TABLES } from "src/services/baserow/constants";
import getBmBlogIssues from "src/services/github/getBmBlogIssues";
import { beforeEach, describe, expect, it, vi } from "vitest";

import syncIssues from "./syncIssues";

function loadIssues(nodes: any[]): void {
  vi.mocked(getBmBlogIssues).mockResolvedValue({
    repository: {
      issues: {
        nodes,
      },
    },
  } as any);
}

describe("syncIssues", () => {
  beforeEach(() => {
    vi.mocked(baserow.listRows).mockResolvedValue({
      results: [],
    } as any);
    loadIssues([{ url: "the_issue_url" }]);
  });

  it("gets issues", async () => {
    await syncIssues();

    expect(getBmBlogIssues).toBeCalled();
  });

  it("looks for existing row", async () => {
    await syncIssues();

    expect(baserow.listRows).toBeCalledWith(
      TABLES.Tasks,
      expect.objectContaining({
        filters: expect.objectContaining({
          filters: expect.arrayContaining([
            {
              type: "equal",
              field: "Source",
              value: "the_issue_url",
            },
          ]),
        }),
      })
    );
  });

  it("creates row if not found", async () => {
    vi.mocked(baserow.listRows).mockResolvedValue({
      results: [],
    } as any);

    await syncIssues();

    expect(baserow.addRow).toBeCalled();
  });

  it("does not create row if found", async () => {
    vi.mocked(baserow.listRows).mockResolvedValue({
      results: [{}],
    } as any);

    await syncIssues();

    expect(baserow.addRow).not.toBeCalled();
  });

  it("creates one row per issue", async () => {
    vi.mocked(baserow.listRows).mockResolvedValue({
      results: [],
    } as any);
    loadIssues([{ url: "issue1" }, { url: "issue2" }]);

    await syncIssues();

    expect(baserow.addRow).toBeCalledTimes(2);
  });

  it('sets "Source" field to issue url', async () => {
    vi.mocked(baserow.listRows).mockResolvedValue({
      results: [],
    } as any);
    loadIssues([{ url: "issue1" }]);

    await syncIssues();

    expect(baserow.addRow).toBeCalledWith(
      TABLES.Tasks,
      expect.objectContaining({
        Source: "issue1",
      })
    );
  });

  it("checks for existing rows for each issue", async () => {
    vi.mocked(baserow.listRows).mockResolvedValue({
      results: [{}],
    } as any);
    loadIssues([{ url: "issue1" }, { url: "issue2" }]);

    await syncIssues();

    expect(baserow.listRows).toBeCalledTimes(2);
  });

  it("uses issue url when looking for existing rows", async () => {
    vi.mocked(baserow.listRows).mockResolvedValue({
      results: [],
    } as any);
    loadIssues([{ url: "issue1" }]);

    await syncIssues();

    expect(baserow.listRows).toBeCalledWith(
      TABLES.Tasks,
      expect.objectContaining({
        filters: expect.objectContaining({
          filters: expect.arrayContaining([
            {
              type: "equal",
              field: "Source",
              value: "issue1",
            },
          ]),
        }),
      })
    );
  });

  it("creates new rows with status Pending", async () => {
    vi.mocked(baserow.listRows).mockResolvedValue({
      results: [],
    } as any);
    loadIssues([{ url: "issue1" }]);

    await syncIssues();

    expect(baserow.addRow).toBeCalledWith(
      TABLES.Tasks,
      expect.objectContaining({
        Status: "Pending",
      })
    );
  });

  it("sets Notes field to issue body", async () => {
    vi.mocked(baserow.listRows).mockResolvedValue({
      results: [],
    } as any);
    loadIssues([{ body: "the_body" }]);

    await syncIssues();

    expect(baserow.addRow).toBeCalledWith(
      TABLES.Tasks,
      expect.objectContaining({
        Notes: "the_body",
      })
    );
  });

  it('sets Project field to "Beeminder Blog"', async () => {
    vi.mocked(baserow.listRows).mockResolvedValue({
      results: [],
    } as any);

    await syncIssues();

    expect(baserow.addRow).toBeCalledWith(
      TABLES.Tasks,
      expect.objectContaining({
        Project: ["Beeminder Blog"],
      })
    );
  });
});
