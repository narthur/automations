import baserow from "src/services/baserow";
import { TABLES } from "src/services/baserow/constants";
import createDatapoint from "src/services/beeminder/createDatapoint";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { type Rate, update } from "./bm";

function rate(value: Partial<Rate> = {}): Rate {
  return {
    Rate: "100",
    Clients: [],
    Projects: [],
    ...value,
  };
}

function mockResults({
  entries = [],
  rates = [rate()],
}: {
  entries?: Record<string, unknown>[];
  rates?: Record<string, unknown>[];
} = {}) {
  vi.mocked(baserow.listRows).mockImplementation((tableId: number): any => {
    if (tableId === TABLES.Entries) {
      return Promise.resolve({
        results: entries,
      });
    }

    if (tableId === TABLES.Rates) {
      return Promise.resolve({
        results: rates.map(rate),
      });
    }

    return Promise.resolve({
      results: [],
    });
  });
}

describe("bm", () => {
  beforeEach(() => {
    mockResults();
  });

  it("filters entries", async () => {
    await update();

    expect(baserow.listRows).toBeCalledWith(TABLES.Entries, {
      filters: expect.anything(),
    });
  });

  it("calculates billable hours", async () => {
    mockResults({
      entries: [
        { Hours: "1.00", Client: [{ value: "Beeminder" }], Rate: "100" },
      ],
      rates: [{ Clients: [{ value: "Beeminder" }], Rate: "100" }],
    });

    await update();

    expect(createDatapoint).toBeCalledWith(
      expect.anything(),
      expect.anything(),
      expect.objectContaining({
        value: 1,
      })
    );
  });

  it("calculates fractional billable hours", async () => {
    mockResults({
      entries: [{ Hours: "1", Client: [{ value: "Beeminder" }], Rate: "50" }],
      rates: [{ Clients: [{ value: "Beeminder" }], Rate: "100" }],
    });

    await update();

    expect(createDatapoint).toBeCalledWith(
      expect.anything(),
      expect.anything(),
      expect.objectContaining({
        value: 0.5,
      })
    );
  });

  it("does not include entries for other clients", async () => {
    mockResults({
      entries: [{ Hours: "1", Client: [{ value: "Other" }], Rate: "100" }],
      rates: [{ Clients: [{ value: "Beeminder" }], Rate: "100" }],
    });

    await update();

    expect(createDatapoint).toBeCalledWith(
      expect.anything(),
      expect.anything(),
      expect.objectContaining({
        value: 0,
      })
    );
  });

  it('does not use rate if client is not "Beeminder"', async () => {
    mockResults({
      entries: [{ Hours: "1", Client: [{ value: "Beeminder" }], Rate: "100" }],
      rates: [
        { Clients: [{ value: "Other" }], Rate: "50" },
        { Clients: [{ value: "Beeminder" }], Rate: "100" },
      ],
    });

    await update();

    expect(createDatapoint).toBeCalledWith(
      expect.anything(),
      expect.anything(),
      expect.objectContaining({
        value: 1,
      })
    );
  });

  it("uses base rate if no client rate", async () => {
    mockResults({
      entries: [{ Hours: "1", Client: [{ value: "Beeminder" }], Rate: "100" }],
      rates: [{ Clients: [], Rate: "100" }],
    });

    await update();

    expect(createDatapoint).toBeCalledWith(
      expect.anything(),
      expect.anything(),
      expect.objectContaining({
        value: 1,
      })
    );
  });

  it("does not use project rate for base rate", async () => {
    mockResults({
      entries: [{ Hours: "1", Client: [{ value: "Beeminder" }], Rate: "100" }],
      rates: [
        { Clients: [], Projects: [{ value: "Project" }], Rate: "50" },
        { Clients: [], Rate: "100" },
      ],
    });

    await update();

    expect(createDatapoint).toBeCalledWith(
      expect.anything(),
      expect.anything(),
      expect.objectContaining({
        value: 1,
      })
    );
  });

  it("throws if no base rate found", async () => {
    mockResults({
      entries: [{ Hours: "1", Client: [{ value: "Beeminder" }], Rate: "100" }],
      rates: [],
    });

    await expect(update()).rejects.toThrow("No base rate found");
  });

  it("uses highest matching base rate", async () => {
    mockResults({
      entries: [{ Hours: "1", Client: [{ value: "Beeminder" }], Rate: "100" }],
      rates: [
        { Clients: [], Rate: "50" },
        { Clients: [], Rate: "100" },
      ],
    });

    await update();

    expect(createDatapoint).toBeCalledWith(
      expect.anything(),
      expect.anything(),
      expect.objectContaining({
        value: 1,
      })
    );
  });
});
