import { getProjects, type Project } from "src/services/narthbugz/index.js";
import { beforeEach, describe, expect, it, vi } from "vitest";

import ppdReport from "./ppdReport.js";

const run = () => ppdReport.action("report", []);

const p = (d: Partial<Project>): Project => {
  return {
    Name: "Project",
    Status: {
      value: "Proposal",
    },
    Snoozed: false,
    "Last Tracked": "2021-01-01",
    "Billable Rate": 0,
    "Effective Rate": 0,
    Estimated: 0,
    Used: 0,
    Remaining: 0,
    Price: 0,
    "Task Count": 0,
    ...d,
  };
};

describe("ppdReport", () => {
  beforeEach(() => {
    vi.mocked(getProjects).mockResolvedValue([
      p({
        Name: "Project 0",
        Status: {
          value: "Proposal",
        },
      }),
      p({
        Name: "Project 1",
        Status: {
          value: "Execution",
        },
      }),
      p({
        Name: "Project 2",
        Status: {
          value: "Complete",
        },
      }),
      p({
        Name: "Project 3",
        Status: {
          value: "Never",
        },
      }),
      p({
        Name: "Project 4",
        Snoozed: true,
      }),
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

  it("supports null values", async () => {
    vi.mocked(getProjects).mockResolvedValue([
      p({
        "Last Tracked": null,
      }),
    ]);

    await run();
  });
});
