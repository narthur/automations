import { describe, it } from "vitest";

import ppdReport from "./ppdReport.js";

const run = () => ppdReport.action("report", []);

describe("ppdReport", () => {
  it("works", async () => {
    await run();
  });
});
