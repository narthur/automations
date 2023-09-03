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

export const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/cron/av-prime", (req, res, next) => {
  avPrime()
    .then(() => res.send("OK"))
    .catch(next);
});

app.get("/cron/gross", (req, res, next) => {
  updateBmGross()
    .then(() => res.send("OK"))
    .catch(next);
});

app.get("/cron/invoice", (req, res, next) => {
  generateInvoices()
    .then(() => res.send("OK"))
    .catch(next);
});

app.get("/cron/morning", (req, res, next) => {
  morning()
    .then(() => res.send("OK"))
    .catch(next);
});

app.get("/cron/reratchet", (req, res, next) => {
  createRecurringTasks()
    .then(() => res.send("OK"))
    .catch(next);
});

app.post("/bot/hook", (req, res, next) => {
  handleBotRequest(req, res)
    .then(() => res.send("OK"))
    .catch(next);
});

app.get("/bot/init", (req, res, next) => {
  setWebhook({
    url: getFullUrl(req, "bot/hook"),
    secret_token: telegramWebhookToken.value(),
  })
    .then(() => res.send("OK"))
    .catch(next);
});
