import {} from "node:test";
import { sendEmail } from "../services/mailgun";
import { getClients, getProjects, getTimeEntries } from "../services/toggl";
import { invoice_cron } from "./invoice";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { TimeEntry, TogglClient, TogglProject } from "../services/toggl/types";

vi.mock("../services/mailgun");

function run(): Promise<unknown> {
  return (invoice_cron as any)();
}

const defaultEntries: Partial<TimeEntry>[] = [
  {
    project_id: 1,
    description: "description1",
    duration: 60 * 60,
    billable: true,
  },
  {
    project_id: 2,
    description: "description2",
    duration: 60 * 60,
    billable: true,
  },
];

const defaultProjects: Partial<TogglProject>[] = [
  {
    id: 1,
    client_id: 1,
    rate: 100,
  },
  {
    id: 2,
    client_id: 2,
    rate: 100,
  },
];

const defaultClients: Partial<TogglClient>[] = [
  {
    id: 1,
    name: "client1",
  },
  {
    id: 2,
    name: "client2",
  },
];

function loadData({
  entries = defaultEntries,
  projects = defaultProjects,
  clients = defaultClients,
}: {
  entries?: Partial<TimeEntry>[];
  projects?: Partial<TogglProject>[];
  clients?: Partial<TogglClient>[];
} = {}) {
  vi.mocked(getTimeEntries).mockResolvedValue(entries as any);
  vi.mocked(getProjects).mockResolvedValue(projects as any);
  vi.mocked(getClients).mockResolvedValue(clients as any);
}

function expectSubjectContains(needle: string) {
  expect(sendEmail).toBeCalledWith(
    expect.objectContaining({
      subject: expect.stringContaining(needle),
    })
  );
}

function expectBodyContains(needle: string) {
  expect(sendEmail).toBeCalledWith(
    expect.objectContaining({
      body: expect.stringContaining(needle),
    })
  );
}

describe("invoice_cron", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // america/new_york is utc-5
    // https://www.zeitverschiebung.net/en/timezone/america--new_york
    vi.setSystemTime(new Date("2021-01-01T05:00:00Z"));

    loadData();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("sends one invoice per client", async () => {
    await run();

    expect(sendEmail).toBeCalledTimes(2);
  });

  it("sends only one email per client", async () => {
    loadData({
      clients: [{}],
    });

    await run();

    expect(sendEmail).toBeCalledTimes(1);
  });

  it("includes total duration", async () => {
    await run();

    expectBodyContains("Total Time: 1 hour");
  });

  it("includes client name in email subject", async () => {
    await run();

    expectSubjectContains("client1");
  });

  it("includes descriptions in email body", async () => {
    await run();

    expectBodyContains("description1");
  });

  it("includes invoice id", async () => {
    await run();

    expectBodyContains("Invoice ID: client1-2020-12");
  });

  it("only fetches time entries for the last month", async () => {
    await run();

    expect(getTimeEntries).toBeCalledWith(
      expect.objectContaining({
        params: expect.objectContaining({
          start_date: "2020-12-01",
          end_date: "2020-12-31",
        }),
      })
    );
  });

  it("includes date range", async () => {
    await run();

    expectBodyContains("2020-12-01 - 2020-12-31");
  });

  it("includes month name in subject", async () => {
    await run();

    expectSubjectContains("December");
  });

  it("skips unbillable time", async () => {
    loadData({
      entries: [
        {
          project_id: 1,
          description: "description1",
          duration: 60 * 60,
          billable: false,
        },
      ],
    });

    await run();

    expect(sendEmail).not.toBeCalledWith(
      expect.objectContaining({
        body: expect.stringContaining("description1"),
      })
    );
  });

  it("lists zero hours if no billable time", async () => {
    loadData({
      entries: [
        {
          project_id: 1,
          duration: 60 * 60,
          billable: false,
        },
      ],
    });

    await run();

    expectBodyContains("Total Time: 0 hours");
  });

  it("includes hourly rate", async () => {
    await run();

    expectBodyContains("Rate: $1.00/hr");
  });

  it("does not include hourly rate if no billable time", async () => {
    loadData({
      entries: [
        {
          project_id: 1,
          duration: 60 * 60,
          billable: false,
        },
      ],
    });

    await run();

    expect(sendEmail).not.toBeCalledWith(
      expect.objectContaining({
        body: expect.stringContaining("Hourly Rate"),
      })
    );
  });

  it("includes total due", async () => {
    await run();

    expectBodyContains("Total Due: $1.00");
  });
});
