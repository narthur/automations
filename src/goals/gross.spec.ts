import { describe, it, expect, vi } from "vitest";
import { getMe } from "../services/toggl/index.js";
import { createDatapoint } from "../services/beeminder.js";
import { update } from "./gross.js";
import uniq from "src/transforms/uniq.js";
import getTimeSummary from "src/services/toggl/getTimeSummary.js";

describe("gross", () => {
  it("sets requestid to daystamp", async () => {
    await update();

    expect(createDatapoint).toBeCalledWith(
      "narthur",
      "gross",
      expect.objectContaining({
        requestid: expect.stringMatching(/^\d\d\d\d-\d\d-\d\d$/),
      })
    );
  });

  it("does not count negative durations", async () => {
    await update();

    expect(createDatapoint).toBeCalledWith(
      "narthur",
      "gross",
      expect.objectContaining({
        value: 0,
      })
    );
  });

  it("does not include non-billable time entries", async () => {
    await update();

    expect(createDatapoint).toBeCalledWith(
      "narthur",
      "gross",
      expect.objectContaining({
        value: 0,
      })
    );
  });

  it("runs for previous week", async () => {
    await update();

    expect(createDatapoint).toBeCalledTimes(7);
  });

  it("sets daystamp to each day of week", async () => {
    await update();

    const daystamps = vi
      .mocked(createDatapoint)
      .mock.calls.map((args) => args[2].daystamp);
    const count = uniq(daystamps).length;

    expect(count).toBe(7);
  });

  it("gets me", async () => {
    await update();

    expect(getMe).toBeCalled();
  });

  it("gets time summary", async () => {
    await update();

    expect(getTimeSummary).toBeCalled();
  });

  it("groups by user", async () => {
    await update();

    expect(getTimeSummary).toBeCalledWith(
      expect.objectContaining({
        grouping: "users",
      })
    );
  });

  it("sums main user entries", async () => {
    vi.mocked(getMe).mockResolvedValue({
      id: 3,
      default_workspace_id: 1,
    } as any);

    vi.mocked(getTimeSummary).mockResolvedValue({
      groups: [
        {
          id: 3,
          sub_groups: [
            {
              id: null,
              title: "the_title",
              seconds: 3600,
              rates: [
                {
                  billable_seconds: 3600,
                  hourly_rate_in_cents: 100,
                  currency: "usd",
                },
              ],
            },
          ],
        },
      ],
    });

    await update();

    expect(createDatapoint).toBeCalledWith(
      "narthur",
      "gross",
      expect.objectContaining({
        value: 1,
      })
    );
  });

  it("sums sub user entries", async () => {
    vi.mocked(getMe).mockResolvedValue({
      id: 3,
      default_workspace_id: 1,
    } as any);

    vi.mocked(getTimeSummary).mockResolvedValue({
      groups: [
        {
          id: 5,
          sub_groups: [
            {
              id: null,
              title: "the_title",
              seconds: 3600,
              rates: [
                {
                  billable_seconds: 3600,
                  hourly_rate_in_cents: 100,
                  currency: "usd",
                },
              ],
            },
          ],
        },
      ],
    });

    await update();

    expect(createDatapoint).toBeCalledWith(
      "narthur",
      "gross",
      expect.objectContaining({
        value: 0.3,
      })
    );
  });

  it("gets me only once", async () => {
    await update();

    expect(getMe).toBeCalledTimes(1);
  });
});
