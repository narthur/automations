import {} from "node:test";

import getBillingSummary from "src/services/toggl/getBillingSummary.js";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { sendEmail } from "../services/mailgun.js";
import generateInvoices from "./generateInvoices.js";

vi.mock("../services/toggl/getBillingSummary");

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

    vi.mocked(getBillingSummary).mockResolvedValue([
      {
        clientId: 1,
        clientName: "client1",
        clientRate: 1,
        tasks: [
          {
            description: "description1",
            billableHours: 1,
          },
        ],
      },
    ]);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("sends one invoice per client", async () => {
    await generateInvoices();

    expect(sendEmail).toBeCalledTimes(1);
  });

  it("includes total duration", async () => {
    await generateInvoices();

    expectBodyContains("Total Billable Hours | 1.00");
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

  it("includes date range", async () => {
    await generateInvoices();

    expectBodyContains("2020-12-01 - 2020-12-31");
  });

  it("includes month name in subject", async () => {
    await generateInvoices();

    expectSubjectContains("December");
  });

  it("includes hourly rate", async () => {
    await generateInvoices();

    expectBodyContains("Rate | $1.00/hr");
  });

  it("includes total due", async () => {
    await generateInvoices();

    expectBodyContains("Total Due | $1.00");
  });

  it("sends invoices to taskratchet email", async () => {
    await generateInvoices();

    expect(sendEmail).toBeCalledWith(
      expect.objectContaining({
        recipients: ["nathan@taskratchet.com"],
      })
    );
  });
});
