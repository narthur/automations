import { listRows } from "baserow-sdk";
import { TABLES } from "src/services/baserow/constants";
import createDatapoint from "src/services/beeminder/createDatapoint";
import { describe, expect, it, vi } from "vitest";

import { POST } from "./baserow";

vi.mock("../../goals/bm");

describe("baserow webhook", () => {
  it("updates gross goal", async () => {
    vi.mocked(listRows).mockImplementation((tableId: number) => {
      if (tableId === TABLES.Rates) {
        return Promise.resolve([
          {
            Rate: "100",
            Clients: [],
            Projects: [],
          },
        ]);
      }
      return Promise.resolve([]);
    });

    await POST();

    expect(createDatapoint).toBeCalledWith(
      "narthur",
      "gross",
      expect.anything()
    );
  });
});
