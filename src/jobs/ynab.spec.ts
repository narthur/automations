import { describe, it, expect } from "vitest";
import ynab from "./ynab";

describe("ynab", () => {
  it("should be true", () => {
    ynab();
    expect(true).toBe(true);
  });
});

// it checks when budget was last reconciled... ?
// tracks amount of money unassigned
// https://api.youneedabudget.com/#quick-start
// https://api.youneedabudget.com/v1#/User/getUser
// https://app.youneedabudget.com/settings/developer
