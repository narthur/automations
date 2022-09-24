import payroll from "./payroll";
import { describe, it, expect, vi, beforeEach } from "vitest";
import sendEmail from "./lib/sendEmail";
import axios, { __loadResponse } from "axios";
import { PROJECTS, setEnv } from "../vitest.setup";
import loadTimeEntries from "./lib/test/loadTimeEntries";

vi.mock("./lib/sendEmail");
vi.mock("axios");

describe("payroll", () => {
  beforeEach(() => {
    setEnv({
      PAYROLL_TOGGL_RECIPIENTS: "the_recipient",
      PAYROLL_TOGGL_PROJECTS: PROJECTS.map((p) => p.id).join(","),
      PAYROLL_GLOBAL_RECIPIENTS: "global_recipient",
    });

    __loadResponse({
      method: ["get", "post"],
      payload: { data: [] },
    });

    vi.mocked(sendEmail).mockClear();
  });

  it("sends email", async () => {
    await payroll();

    expect(sendEmail).toBeCalled();
  });

  it("sends email to recipient", async () => {
    await payroll();

    expect(sendEmail).toBeCalledWith(
      expect.objectContaining({
        recipients: expect.arrayContaining([
          "global_recipient",
          "the_recipient",
        ]),
      })
    );
  });

  it("gets time entries", async () => {
    await payroll();

    expect(axios.get).toBeCalledWith(
      expect.stringMatching(/toggl/),
      expect.anything()
    );
  });

  it("includes sum in email", async () => {
    loadTimeEntries([{}]);

    await payroll();

    expect(sendEmail).toBeCalledWith(
      expect.objectContaining({
        body: expect.stringMatching(/Total time: 1/),
      })
    );
  });

  it("only includes whitelisted projects", async () => {
    loadTimeEntries([
      {
        project_id: "wrong_id",
      },
    ]);

    await payroll();

    expect(sendEmail).toBeCalledWith(
      expect.objectContaining({
        body: expect.stringMatching(/Total time: 0/),
      })
    );
  });

  it("sets email subject", async () => {
    await payroll();

    expect(sendEmail).toBeCalledWith(
      expect.objectContaining({
        subject: expect.stringMatching(/Invoice/),
      })
    );
  });

  it("includes year and month in subject", async () => {
    vi.setSystemTime(new Date("2021-02-03"));

    await payroll();

    expect(sendEmail).toBeCalledWith(
      expect.objectContaining({
        subject: expect.stringMatching(/1\/1\/2021/),
      })
    );
  });
});
