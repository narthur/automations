import payroll from "./payroll";
import { describe, it, expect, vi, beforeEach } from "vitest";
import sendEmail from "./lib/sendEmail";
import axios, { __loadResponse } from "axios";
import { setEnv } from "../vitest.setup";
import loadTimeEntries from "./lib/test/loadTimeEntries";

vi.mock("./lib/sendEmail");
vi.mock("axios");

describe("payroll", () => {
  beforeEach(() => {
    setEnv({
      PAYROLL_RECIPIENTS: "the_recipient",
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

    expect(sendEmail).toBeCalledWith(["the_recipient"], expect.anything());
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
      expect.anything(),
      expect.stringMatching(/Total time: 1/)
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
      expect.anything(),
      expect.stringMatching(/Total time: 0/)
    );
  });
});
