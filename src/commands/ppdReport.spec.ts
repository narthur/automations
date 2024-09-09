import { getProjects } from "src/services/narthbugz/index.js";
import { beforeEach, describe, expect, it, vi } from "vitest";

import ppdReport from "./ppdReport.js";

const run = () => ppdReport.action("report", []);

describe("ppdReport", () => {
  beforeEach(() => {
    vi.mocked(getProjects).mockResolvedValue([
      {
        Name: "Project 0",
        Status: {
          value: "Proposal",
        },
        Snoozed: false,
      },
      {
        Name: "Project 1",
        Status: {
          value: "Execution",
        },
        Snoozed: false,
      },
      {
        Name: "Project 2",
        Status: {
          value: "Complete",
        },
        Snoozed: false,
      },
      {
        Name: "Project 3",
        Status: {
          value: "Never",
        },
        Snoozed: false,
      },
      {
        Name: "Project 4",
        Status: {
          value: "Proposal",
        },
        Snoozed: true,
      },
    ]);
  });

  it("gets projects", async () => {
    await run();

    expect(getProjects).toBeCalled();
  });

  it("outputs project names", async () => {
    const output = await run();

    expect(output).toContain("Project 1");
  });

  it('does not output "Never" projects', async () => {
    const output = await run();

    expect(output).not.toContain("Project 3");
  });

  it('does not output "Complete" projects', async () => {
    const output = await run();

    expect(output).not.toContain("Project 2");
  });

  it('does not output "Snoozed" projects', async () => {
    const output = await run();

    expect(output).not.toContain("Project 4");
  });
});
