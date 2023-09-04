import express from "express";
import avPrime from "src/effects/av-prime.js";
import handleBotRequest from "./effects/handleBotRequest.js";
import { setWebhook } from "./services/telegram.js";
import { telegramWebhookToken } from "./secrets.js";
import getFullUrl from "./transforms/getFullUrl.js";
import updateBmGross from "./effects/updateBmGross.js";
import generateInvoices from "./effects/generateInvoices.js";
import morning from "./effects/morning.js";
import createRecurringTasks from "./effects/createRecurringTasks.js";
import cors from "cors";

export const app = express();

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
