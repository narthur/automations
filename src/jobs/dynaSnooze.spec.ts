import { updateDocument } from "src/services/dynalist";
import getNodes, { type AugmentedNode } from "src/services/dynalist/getNodes";
import { beforeEach, describe, expect, it, vi } from "vitest";

import dynaSnooze from "./dynaSnooze";

vi.mock("src/services/dynalist/getNodes");

vi.setSystemTime(new Date("2022-01-01"));

describe("dynaSnooze", () => {
  beforeEach(() => {
    vi.mocked(getNodes).mockResolvedValue([
      {
        id: "the_id_1",
        file_id: "the_file_id",
        content: "the_content_1 #snooze=2022-01-01",
        children: [],
      },
    ] as Partial<AugmentedNode>[] as any);
  });

  it("gets nodes", async () => {
    await dynaSnooze();

    expect(getNodes).toBeCalled();
  });

  it("snoozes node when snooze date is in the future", async () => {
    vi.mocked(getNodes).mockResolvedValue([
      {
        id: "the_id_1",
        file_id: "the_file_id",
        content: "the_content_1 #snooze=2023-01-01",
        children: [],
      },
    ] as Partial<AugmentedNode>[] as any);

    await dynaSnooze();

    expect(updateDocument).toBeCalled();
  });

  it("unsnooses if snooze date is in the past", async () => {
    vi.mocked(getNodes).mockResolvedValue([
      {
        id: "the_id_1",
        file_id: "the_file_id",
        content: "the_content_1 #snooze=2021-01-01 #snoozed",
        checked: true,
        children: [],
      },
    ] as Partial<AugmentedNode>[] as any);

    await dynaSnooze();

    expect(updateDocument).toBeCalledWith({
      file_id: "the_file_id",
      changes: [
        {
          action: "edit",
          node_id: "the_id_1",
          content: "the_content_1 #snooze=2021-01-01",
          checked: false,
        },
      ],
    });
  });
});
