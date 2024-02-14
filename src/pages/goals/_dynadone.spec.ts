import createDatapoint from "src/services/beeminder/createDatapoint";
import getGoal from "src/services/beeminder/getGoal";
import { getDocument, getFiles } from "src/services/dynalist";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { GET } from "./dynadone";

describe("dynadone", () => {
  beforeEach(() => {
    vi.mocked(getGoal).mockResolvedValue({
      deadline: 0,
    } as any);

    vi.mocked(getFiles).mockResolvedValue({
      files: [
        {
          type: "document",
          id: "the_id",
        },
      ],
    } as any);
  });

  it("runs dynadone", async () => {
    const res = await GET();

    expect(res.status).toBe(200);
    expect(await res.text()).toBe("OK");

    expect(getDocument).toBeCalled();
    expect(createDatapoint).toBeCalled();
  });
});
