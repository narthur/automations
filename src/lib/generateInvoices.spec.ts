import {} from "node:test";
import { sendEmail } from "../services/mailgun.js";
import {
  getClients,
  getProjects,
  getTimeEntries,
} from "../services/toggl/index.js";
import generateInvoices from "./generateInvoices.js";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  TimeEntry,
  TogglClient,
  TogglProject,
} from "../services/toggl/types.js";

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
    rate: 1,
  },
  {
    id: 2,
    client_id: 2,
    rate: 1,
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
      markdown: expect.stringContaining(needle),
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
    await generateInvoices();

    expect(sendEmail).toBeCalledTimes(2);
  });

  it("sends only one email per client", async () => {
    loadData({
      clients: [{}],
    });

    await generateInvoices();

    expect(sendEmail).toBeCalledTimes(1);
  });

  it("includes total duration", async () => {
    await generateInvoices();

    expectBodyContains("Total Time | 1.00 hour");
  });

  it("includes client name in email subject", async () => {
    await generateInvoices();

    expectSubjectContains("client1");
  });

  it("includes descriptions in email body", async () => {
    await generateInvoices();

    expectBodyContains("description1");
  });

  it("includes invoice id", async () => {
    await generateInvoices();

    expectBodyContains("Invoice ID | client1-2020-12");
  });

  it("only fetches time entries for the last month", async () => {
    await generateInvoices();

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
    await generateInvoices();

    expectBodyContains("2020-12-01 - 2020-12-31");
  });

  it("includes month name in subject", async () => {
    await generateInvoices();

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

    await generateInvoices();

    expect(sendEmail).not.toBeCalledWith(
      expect.objectContaining({
        markdown: expect.stringContaining("description1"),
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

    await generateInvoices();

    expectBodyContains("Total Time | 0.00 hours");
  });

  it("includes hourly rate", async () => {
    await generateInvoices();

    expectBodyContains("Rate | $1.00/hr");
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

    await generateInvoices();

    expectBodyContains("Rate | n/a");
  });

  it("includes total due", async () => {
    await generateInvoices();

    expectBodyContains("Total Due | $1.00");
  });
});
