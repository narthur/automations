import payroll from "./payroll";
import { describe, it, expect, vi, beforeEach } from "vitest";
import sendEmail from "./lib/sendEmail";

vi.mock("./lib/sendEmail");

describe("payroll", () => {
  beforeEach(() => {
    process.env = {
      ...process.env,
      PAYROLL_RECIPIENTS: "the_recipient",
    };
  });

  it("sends email", async () => {
    await payroll();

    expect(sendEmail).toBeCalled();
  });

  it("sends email to recipient", async () => {
    await payroll();

    expect(sendEmail).toBeCalledWith("the_recipient");
  });
});
