import * as Sentry from "@sentry/node";
import { ProfilingIntegration } from "@sentry/profiling-node";
import { AxiosError } from "axios";
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
import createDatapoint from "./services/beeminder/createDatapoint.js";
import { setWebhook } from "./services/telegram/index.js";
import event from "./services/toggl/schemas/event.js";
import validateTogglRequest from "./services/toggl/validateTogglRequest.js";

export const app = express();

Sentry.init({
  dsn: SENTRY_DSN.value(),
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Sentry.Integrations.Express({ app }),
    new ProfilingIntegration(),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!
  // Set sampling rate for profiling - this is relative to tracesSampleRate
  profilesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!
  release: process.env.RENDER_GIT_COMMIT,
});

// The request handler must be the first middleware on the app
app.use(Sentry.Handlers.requestHandler());

// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

app.use(cors(), express.json());

type Fn = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => unknown;

function _get(path: string, fn: Fn) {
  app.get(path, (req, res, next) => {
    Promise.resolve(fn(req, res, next))
      .then((d) => res.send(d || "OK"))
      .catch(next);
  });
}

_get("/", () => "Hello World!");

// TODO: rename to /goals/*
_get("/cron/techtainment", techtainment.update);
_get("/cron/gross", gross.update);
_get("/cron/dynalist", dynanew.update);
_get("/cron/dynadone", dynadone.update);
_get("/cron/billable", billable.update);

app.post("/hooks/email-zero", (req, res) => {
  const data = z
    .object({
      count: z.number(),
    })
    .parse(req.body);

  createDatapoint("narthur", "email-zero", {
    value: data.count > 0 ? 0 : 1,
    comment: `Emails: ${data.count} (${new Date().toLocaleDateString()})`,
  })
    .then(() => res.send("OK"))
    .catch((e: AxiosError) => {
      console.error(e.message);
      res.status(500).send(e.message);
    });
});

app.post("/hooks/tr-email-zero", (req, res) => {
  const data = z
    .object({
      count: z.number(),
    })
    .parse(req.body);

  createDatapoint("narthur", "tr-email-zero", {
    value: data.count > 0 ? 0 : 1,
    comment: `Emails: ${data.count} (${new Date().toLocaleDateString()})`,
  })
    .then(() => res.send("OK"))
    .catch((e: AxiosError) => {
      console.error(e.message);
      res.status(500).send(e.message);
    });
});

app.post("/hooks/av-email-zero", (req, res) => {
  const data = z
    .object({
      count: z.number(),
    })
    .parse(req.body);

  createDatapoint("narthur", "av-email-zero", {
    value: data.count > 0 ? 0 : 1,
    comment: `Emails: ${data.count} (${new Date().toLocaleDateString()})`,
  })
    .then(() => res.send("OK"))
    .catch((e: AxiosError) => {
      console.error(e.message);
      res.status(500).send(e.message);
    });
});

// TODO: rename to /hooks/toggl
app.post("/toggl/hook", (req, res) => {
  if (!validateTogglRequest(req)) {
    res.status(401).send("Unauthorized");
    return;
  }

  console.log("/toggl/hook", req.body);

  void billable.update();
  void gross.update();
  void techtainment.update();

  // TODO: update schema to support all event types
  const e = event.parse(req.body);

  if (e.metadata.model === "time_entry") {
    void createSummaryTask(e);
  }

  res.send("OK");
});

// TODO: rename to /hooks/telegram
app.post("/bot/hook", (req, res) => {
  void handleBotRequest(req, res);
});

// TODO: rename to /hooks/telegram/init
_get("/bot/init", (req) =>
  setWebhook({
    url: getFullUrl(req, "bot/hook"),
    secret_token: TELEGRAM_WEBHOOK_TOKEN.value(),
  })
);

// The error handler must be registered before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());
