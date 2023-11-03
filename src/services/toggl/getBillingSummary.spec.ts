import { describe, it, expect, beforeEach, vi } from "vitest";
import getBillingSummary from "./getBillingSummary.js";
import searchTimeEntries from "./searchTimeEntries.js";
import { getClients, getProjects } from "./index.js";

function run() {
  return getBillingSummary({
    startDate: new Date("2020-01-01"),
    endDate: new Date("2020-01-31"),
  });
}

describe("getBillingSummary", () => {
  beforeEach(() => {
    vi.mocked(getClients).mockResolvedValue([
      {
        id: 3,
        name: "the_client",
      },
    ] as any);

    vi.mocked(getProjects).mockResolvedValue([
      {
        id: 1,
        name: "the_project",
        client_id: 3,
        rate: 1,
      },
    ] as any);

    vi.mocked(searchTimeEntries).mockResolvedValue({
      groups: [
        {
          // project
          id: 1,
          sub_groups: [
            {
              // entry
              id: 7,
              title: "the_description",
              seconds: 60 * 60 * 2,
              rates: [
                {
                  billable_seconds: 60 * 60,
                  hourly_rate_in_cents: 100,
                  currency: "USD",
                },
                {
                  billable_seconds: 60 * 60,
                  hourly_rate_in_cents: 50,
                  currency: "USD",
                },
              ],
            },
          ],
        },
      ],
    });
  });

  it("returns the billing summary", async () => {
    const result = await run();

    expect(result).toEqual([
      {
        clientId: 3,
        clientName: "the_client",
        clientRate: 1,
        tasks: [
          {
            description: "the_description",
            billableHours: 1.5,
          },
        ],
      },
    ]);
  });

  it("gets projects", async () => {
    await run();

    expect(getProjects).toBeCalled();
  });

  it("throws if unable to find project rate", async () => {
    vi.mocked(getProjects).mockResolvedValue([]);

    await expect(() => run()).rejects.toThrow("No project found for id 1");
  });

  it("consolidates clients", async () => {
    vi.mocked(getProjects).mockResolvedValue([
      {
        id: 1,
        name: "project1",
        client_id: 3,
        rate: 1,
      },
      {
        id: 2,
        name: "project2",
        client_id: 3,
        rate: 1,
      },
    ] as any);

    vi.mocked(searchTimeEntries).mockResolvedValue({
      groups: [
        {
          // project
          id: 1,
          sub_groups: [
            {
              // entry
              id: 7,
              title: "the_description",
              seconds: 60 * 60 * 2,
              rates: [
                {
                  billable_seconds: 60 * 60,
                  hourly_rate_in_cents: 100,
                  currency: "USD",
                },
              ],
            },
          ],
        },
        {
          // project
          id: 2,
          sub_groups: [
            {
              // entry
              id: 7,
              title: "the_description",
              seconds: 60 * 60 * 2,
              rates: [
                {
                  billable_seconds: 60 * 60,
                  hourly_rate_in_cents: 100,
                  currency: "USD",
                },
              ],
            },
          ],
        },
      ],
    });

    const summary = await run();

    expect(summary).toHaveLength(1);
  });

  it("throws if one client has multiple rates", async () => {
    vi.mocked(getProjects).mockResolvedValue([
      {
        id: 1,
        name: "project1",
        client_id: 3,
        rate: 1,
      },
      {
        id: 2,
        name: "project2",
        client_id: 3,
        rate: 2,
      },
    ] as any);

    vi.mocked(searchTimeEntries).mockResolvedValue({
      groups: [
        {
          // project
          id: 1,
          sub_groups: [
            {
              // entry
              id: 7,
              title: "the_description",
              seconds: 60 * 60 * 2,
              rates: [
                {
                  billable_seconds: 60 * 60,
                  hourly_rate_in_cents: 100,
                  currency: "USD",
                },
              ],
            },
          ],
        },
        {
          // project
          id: 2,
          sub_groups: [
            {
              // entry
              id: 7,
              title: "the_description",
              seconds: 60 * 60 * 2,
              rates: [
                {
                  billable_seconds: 60 * 60,
                  hourly_rate_in_cents: 200,
                  currency: "USD",
                },
              ],
            },
          ],
        },
      ],
    });

    await expect(() => run()).rejects.toThrow(/Client rate mismatch/);
  });
});
