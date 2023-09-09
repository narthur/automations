import express from "express";
import avPrime from "src/effects/av-prime.js";
import handleBotRequest from "./effects/handleBotRequest.js";
import { setWebhook } from "./services/telegram.js";
import { sentryDsn, telegramWebhookToken } from "./secrets.js";
import getFullUrl from "./transforms/getFullUrl.js";
import updateBmGross from "./effects/updateBmGross.js";
import generateInvoices from "./effects/generateInvoices.js";
import morning from "./effects/morning.js";
import createRecurringTasks from "./effects/createRecurringTasks.js";
import cors from "cors";
import * as Sentry from "@sentry/node";
import { ProfilingIntegration } from "@sentry/profiling-node";

export const app = express();

Sentry.init({
  dsn: sentryDsn.value(),
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
_get("/cron/av-prime", avPrime);
_get("/cron/gross", updateBmGross);
_get("/cron/invoice", generateInvoices);
_get("/cron/morning", morning);
_get("/cron/reratchet", createRecurringTasks);

app.post("/bot/hook", (req, res) => {
  void handleBotRequest(req, res);
});

_get("/bot/init", (req) =>
  setWebhook({
    url: getFullUrl(req, "bot/hook"),
    secret_token: telegramWebhookToken.value(),
  })
);

app.get("/debug-sentry", () => {
  throw new Error("My first Sentry error!");
});

// The error handler must be registered before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());
