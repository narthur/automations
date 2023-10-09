import { app } from "./app.js";
import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import { getTimeEntries } from "./services/toggl/index.js";
import { setWebhook } from "./services/telegram/index.js";
import { createTask, getPendingTasks } from "./services/taskratchet.js";
import { getDocument, getFiles } from "./services/dynalist/index.js";
import { afterEach } from "node:test";
import { createDatapoint } from "./services/beeminder.js";
import getTimeSummary from "./services/toggl/getTimeSummary.js";

describe("index", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(0);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

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

    expect(getTimeSummary).toBeCalled();
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

  it("gets dynalist files", async () => {
    await request(app).get("/cron/dynalist");

    expect(getFiles).toBeCalled();
  });

  it("gets dynalist documents", async () => {
    vi.mocked(getFiles).mockResolvedValue({
      files: [
        {
          type: "document",
          id: "the_id",
        },
      ],
    } as any);

    await request(app).get("/cron/dynalist");

    expect(getDocument).toBeCalledWith({
      file_id: "the_id",
    });
  });

  it("does not get folders", async () => {
    vi.mocked(getFiles).mockResolvedValue({
      files: [
        {
          type: "folder",
          id: "the_id",
        },
      ],
    } as any);

    await request(app).get("/cron/dynalist");

    expect(getDocument).not.toBeCalled();
  });

  it("posts new nodes to beeminder", async () => {
    vi.mocked(getFiles).mockResolvedValue({
      files: [
        {
          type: "document",
          id: "the_id",
        },
      ],
    } as any);

    vi.mocked(getDocument).mockResolvedValue({
      nodes: [
        {
          id: "the_node_id",
          content: "the_content",
          created: 0,
        },
      ],
    } as any);

    await request(app).get("/cron/dynalist");

    expect(createDatapoint).toBeCalledWith("narthur", "dynanew", {
      value: 1,
      daystamp: expect.stringMatching(/\d{4}-\d{2}-\d{2}/),
      requestid: expect.stringMatching(/\d{4}-\d{2}-\d{2}/),
    });
  });

  it("updates datapoints for past week", async () => {
    await request(app).get("/cron/dynalist");

    expect(createDatapoint).toBeCalledTimes(7);
  });

  it("only gets each document once", async () => {
    vi.mocked(getFiles).mockResolvedValue({
      files: [
        {
          type: "document",
          id: "the_id",
        },
      ],
    } as any);

    await request(app).get("/cron/dynalist");

    expect(getDocument).toBeCalledTimes(1);
  });
});
