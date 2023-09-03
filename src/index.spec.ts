import { app } from "./index.js";
import { describe, it, expect, vi } from "vitest";
import request from "supertest";
import { getTimeEntries } from "./services/toggl/index.js";

vi.mock("./services/beeminder");

describe("index", () => {
  it("runs", async () => {
    const res = await request(app).get("/");

    expect(res.status).toBe(200);
    expect(res.text).toBe("Hello World!");
  });

  it("runs av-prime", async () => {
    const res = await request(app).get("/cron/av-prime");

    expect(res.status).toBe(200);
    expect(getTimeEntries).toHaveBeenCalled();
  });
});
