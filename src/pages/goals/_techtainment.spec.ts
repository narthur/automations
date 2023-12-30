import getDatapoints from "src/services/beeminder/getDatapoints";
import { getMe } from "src/services/toggl/getMe";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { GET } from "./techtainment";

describe("techtainment", () => {
  beforeEach(() => {
    vi.mocked(getMe).mockResolvedValue({
      id: 1,
      default_workspace_id: 7,
    } as any);
  });

  it("runs techtainment", async () => {
    await GET();

    expect(getDatapoints).toHaveBeenCalled();
  });
});
