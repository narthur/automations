import { createDatapoint } from "../services/beeminder";
import { queryDatabase } from "../services/notion";
import trCards from "./tr-cards";
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("src/services/beeminder");

describe("tr-cards", () => {
  beforeEach(() => {
    vi.mocked(queryDatabase).mockResolvedValue({
      results: [
        {
          last_edited_time: "2023-03-08T18:25:00.000Z",
        },
      ],
      has_more: false,
    } as any);
  });

  it("queries database", async () => {
    await trCards();

    expect(queryDatabase).toBeCalled();
  });

  it("handles pagination", async () => {
    vi.mocked(queryDatabase).mockResolvedValueOnce({
      results: [],
      has_more: true,
      next_cursor: "next_cursor",
    } as any);

    await trCards();

    expect(queryDatabase).toBeCalledTimes(2);
  });

  it("posts to beeminder", async () => {
    await trCards();

    expect(createDatapoint).toBeCalled();
  });

  it("counts docs", async () => {
    vi.mocked(queryDatabase).mockResolvedValue({
      results: [
        {
          last_edited_time: "2023-03-08T18:25:00.000Z",
        },
        {
          last_edited_time: "2023-03-08T18:25:00.000Z",
        },
      ],
      has_more: false,
    } as any);

    await trCards();

    expect(createDatapoint).toBeCalledWith("narthur", "tr-cards", {
      value: 2,
      daystamp: "2023-03-08",
    });
  });

  it("creates datapoint for each date", async () => {
    vi.mocked(queryDatabase).mockResolvedValue({
      results: [
        {
          last_edited_time: "2023-03-08T18:25:00.000Z",
        },
        {
          last_edited_time: "2023-03-09T18:25:00.000Z",
        },
      ],
      has_more: false,
    } as any);

    await trCards();

    expect(createDatapoint).toBeCalledWith("narthur", "tr-cards", {
      value: 1,
      daystamp: "2023-03-08",
    });

    expect(createDatapoint).toBeCalledWith("narthur", "tr-cards", {
      value: 1,
      daystamp: "2023-03-09",
    });
  });
});
