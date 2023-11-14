import * as Sentry from "@sentry/node";
import { ProfilingIntegration } from "@sentry/profiling-node";
import cors from "cors";
import express from "express";
import * as techtainment from "src/goals/techtainment.js";
import z from "zod";

// TODO: modify ./goals/* exports to allow for cleaner imports
import * as billable from "./goals/billable.js";
import * as dynadone from "./goals/dynadone.js";
import * as dynanew from "./goals/dynanew.js";
import * as gross from "./goals/gross.js";
import createSummaryTask from "./lib/createSummaryTask.js";
import getFullUrl from "./lib/getFullUrl.js";
import handleBotRequest from "./lib/handleBotRequest.js";
import { SENTRY_DSN, TELEGRAM_WEBHOOK_TOKEN } from "./secrets.js";
import createBinaryDatapoint from "./services/beeminder/createBinaryDatapoint.js";
import { setWebhook } from "./services/telegram/index.js";
import event from "./services/toggl/schemas/event.js";
import validateTogglRequest from "./services/toggl/validateTogglRequest.js";

export const exp = express();

Sentry.init({
  dsn: SENTRY_DSN.value(),
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Sentry.Integrations.Express({ app: exp }),
    new ProfilingIntegration(),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!
  // Set sampling rate for profiling - this is relative to tracesSampleRate
  profilesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!
  release: process.env.RENDER_GIT_COMMIT,
});

// The request handler must be the first middleware on the app
exp.use(Sentry.Handlers.requestHandler());

// TracingHandler creates a trace for every incoming request
exp.use(Sentry.Handlers.tracingHandler());

exp.use(cors(), express.json());

type Fn = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => unknown;

function createMethod(method: "get" | "post") {
  return (path: string, fn: Fn) => {
    exp[method](path, (req, res, next) => {
      Promise.resolve(fn(req, res, next))
        .then((d) => res.send(d || "OK"))
        .catch(next);
    });
  };
}

const app = {
  get: createMethod("get"),
  post: createMethod("post"),
};

app.get("/", () => "Hello World!");

// TODO: rename to /goals/*
app.get("/cron/techtainment", techtainment.update);
app.get("/cron/gross", gross.update);
app.get("/cron/dynalist", dynanew.update);
app.get("/cron/dynadone", dynadone.update);
app.get("/cron/billable", billable.update);

// TODO: rename to /goals/email-zero
app.post("/hooks/email-zero", (req) => {
  const data = z
    .object({
      count: z.number(),
    })
    .parse(req.body);

  return createBinaryDatapoint("narthur", "email-zero", {
    value: data.count > 0 ? 0 : 1,
    comment: `Emails: ${data.count} (${new Date().toLocaleString()})`,
  });
});

// TODO: rename to /goals/tr-email-zero
app.post("/hooks/tr-email-zero", (req) => {
  const data = z
    .object({
      count: z.number(),
    })
    .parse(req.body);

  return createBinaryDatapoint("narthur", "tr-email-zero", {
    value: data.count > 0 ? 0 : 1,
    comment: `Emails: ${data.count} (${new Date().toLocaleString()})`,
  });
});

// TODO: rename to /goals/av-email-zero
app.post("/hooks/av-email-zero", (req) => {
  const data = z
    .object({
      count: z.number(),
    })
    .parse(req.body);

  return createBinaryDatapoint("narthur", "av-email-zero", {
    value: data.count > 0 ? 0 : 1,
    comment: `Emails: ${data.count} (${new Date().toLocaleString()})`,
  });
});

app.post("/hooks/toggl", (req, res) => {
  if (!validateTogglRequest(req)) {
    res.status(401).send("Unauthorized");
    return;
  }

  console.log("/toggl/hook", req.body);

  void billable.update();
  void gross.update();
  void techtainment.update();

  const result = event.safeParse(req.body);

  if (result.success && result.data.metadata.model === "time_entry") {
    void createSummaryTask(result.data);
  }
});

// TODO: rename to /hooks/telegram
app.post("/bot/hook", handleBotRequest);

// TODO: rename to /hooks/telegram/init
app.get("/bot/init", (req) =>
  setWebhook({
    url: getFullUrl(req, "bot/hook"),
    secret_token: TELEGRAM_WEBHOOK_TOKEN.value(),
  })
);

// The error handler must be registered before any other error middleware and after all controllers
exp.use(Sentry.Handlers.errorHandler());
