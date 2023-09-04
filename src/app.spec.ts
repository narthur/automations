import { app } from "./app.js";
import { describe, it, expect, vi } from "vitest";
import request from "supertest";
import { getTimeEntries } from "./services/toggl/index.js";
import { setWebhook } from "./services/telegram.js";
import { createTask, getPendingTasks } from "./services/taskratchet.js";

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

  it("has bot hook", async () => {
    const res = await request(app)
      .post("/bot/hook")
      .set(
        "x-telegram-bot-api-secret-token",
        "__SECRET_TELEGRAM_WEBHOOK_TOKEN__"
      )
      .send({
        message: {
          text: "hello world",
          from: {
            id: "__SECRET_TELEGRAM_ALLOWED_USER__",
          },
          chat: {
            id: "the_chat_id",
          },
        },
      });

    expect(res.status).toBe(200);
    expect(res.text).toBe("OK");
  });

  it("has bot init", async () => {
    const res = await request(app).get("/bot/init");

    expect(res.status).toBe(200);

    expect(setWebhook).toBeCalled();
  });

  it("runs gross", async () => {
    const res = await request(app).get("/cron/gross");

    expect(res.status).toBe(200);
    expect(res.text).toBe("OK");

    expect(getTimeEntries).toBeCalled();
  });

  it("runs invoice", async () => {
    vi.mocked(getTimeEntries).mockResolvedValue([
      {
        workspace_id: 1,
      } as any,
    ]);

    const res = await request(app).get("/cron/invoice");

    expect(res.status).toBe(200);
    expect(res.text).toBe("OK");

    expect(getTimeEntries).toBeCalled();
  });

  it("runs morning flow", async () => {
    const res = await request(app).get("/cron/morning");

    expect(res.status).toBe(200);
    expect(res.text).toBe("OK");

    expect(getPendingTasks).toBeCalled();
  });

  it("runs reratchet", async () => {
    const res = await request(app).get("/cron/reratchet");

    expect(res.status).toBe(200);
    expect(res.text).toBe("OK");

    expect(createTask).toBeCalled();
  });
});
