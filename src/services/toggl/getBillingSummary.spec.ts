import { beforeEach, describe, expect, it, vi } from "vitest";

import getBillingSummary from "./getBillingSummary.js";
import { getProjects } from "./getProjects.js";
import getTimeSummary from "./getTimeSummary.js";
import { getClients } from "./index.js";

function run() {
  return getBillingSummary({
    startDate: new Date("2020-01-01"),
    endDate: new Date("2020-01-31"),
  });
}

function entry(rates: [number, number][] = [[60 * 60, 100]]) {
  const id = Math.floor(Math.random() * 1000);
  return {
    id,
    title: `the_description_${id}`,
    seconds: rates.reduce((sum, [s]) => sum + s, 0),
    rates: rates.map(([s, r]) => ({
      billable_seconds: s,
      hourly_rate_in_cents: r,
      currency: "USD",
    })),
  };
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

    vi.mocked(getTimeSummary).mockResolvedValue({
      groups: [
        {
          id: 1,
          sub_groups: [
            entry([
              [60 * 60, 100],
              [60 * 60, 50],
            ]),
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
            description: expect.stringMatching(/the_description/),
            billableHours: 1.5,
          },
        ],
      },
    ]);
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

    vi.mocked(getTimeSummary).mockResolvedValue({
      groups: [
        {
          id: 1,
          sub_groups: [entry()],
        },
        {
          id: 2,
          sub_groups: [entry()],
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

    vi.mocked(getTimeSummary).mockResolvedValue({
      groups: [
        {
          id: 1,
          sub_groups: [entry([[60 * 60, 100]])],
        },
        {
          id: 2,
          sub_groups: [entry([[60 * 60, 200]])],
        },
      ],
    });

    await expect(() => run()).rejects.toThrow(/Client rate mismatch/);
  });

  it("skips projects without a client", async () => {
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
        client_id: null,
        rate: 1,
      },
    ] as any);

    vi.mocked(getTimeSummary).mockResolvedValue({
      groups: [
        {
          id: 1,
          sub_groups: [entry([[60 * 60, 100]])],
        },
        {
          id: 2,
          sub_groups: [entry([[60 * 60, 100]])],
        },
      ],
    });

    const summary = await run();

    expect(summary).toHaveLength(1);
  });
});
