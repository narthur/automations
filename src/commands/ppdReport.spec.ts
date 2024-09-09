import { getProjects } from "src/services/narthbugz/index.js";
import { describe, expect, it } from "vitest";

import ppdReport from "./ppdReport.js";

const run = () => ppdReport.action("report", []);

describe("ppdReport", () => {
  it("gets projects", async () => {
    await run();

    expect(getProjects).toBeCalled();
  });
});
