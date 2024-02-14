import createDatapoint from "src/services/beeminder/createDatapoint";
import getGoal from "src/services/beeminder/getGoal";
import { getDocument, getFiles } from "src/services/dynalist";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { GET } from "./dynanew";

describe("dynanew", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(0);

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

  afterEach(() => {
    vi.useRealTimers();
  });

  it("gets dynalist files", async () => {
    await GET();

    expect(getFiles).toBeCalled();
  });

  it("gets dynalist documents", async () => {
    await GET();

    expect(getDocument).toBeCalledWith({
      file_id: "the_id",
    });
  });

  it("does not get folders", async () => {
    vi.mocked(getFiles).mockResolvedValue({
      files: [
        {
          type: "folder",
          id: "the_id",
        },
      ],
    } as any);

    await GET();

    expect(getDocument).not.toBeCalled();
  });

  it("posts new nodes to beeminder", async () => {
    vi.mocked(getDocument).mockResolvedValue({
      nodes: [
        {
          id: "the_node_id",
          content: "the_content",
          created: 0,
        },
      ],
    } as any);

    await GET();

    expect(createDatapoint).toBeCalledWith("narthur", "dynanew", {
      value: 1,
      daystamp: expect.stringMatching(/\d{4}-\d{2}-\d{2}/),
      requestid: expect.stringMatching(/\d{4}-\d{2}-\d{2}/),
    });
  });

  it("updates datapoints for past week", async () => {
    await GET();

    expect(createDatapoint).toBeCalledTimes(7);
  });

  it("only gets each document once", async () => {
    await GET();

    expect(getDocument).toBeCalledTimes(1);
  });
});
