import { getMe } from "src/services/toggl/getMe";
import getProjectsSummary from "src/services/toggl/getProjectsSummary";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { GET } from "./techtainment";

describe("techtainment", () => {
  beforeEach(() => {
    vi.mocked(getMe).mockResolvedValue({
      id: 1,
      default_workspace_id: 7,
    } as any);

    vi.mocked(getProjectsSummary).mockResolvedValue([
      {
        user_id: 1,
        project_id: 1,
        tracked_seconds: 3600,
        billable_seconds: 3600,
      },
    ]);
  });

  it("runs techtainment", async () => {
    await GET();

    expect(getProjectsSummary).toHaveBeenCalled();
  });
});
