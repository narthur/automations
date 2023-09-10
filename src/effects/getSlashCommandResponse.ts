import { SELF_CARE } from "src/constants.js";
import { getPendingTasks } from "../services/taskratchet.js";
import generateInvoices from "./generateInvoices.js";
import getBeemergencies from "./getBeemergencies.js";
import { clearHistory } from "./history.js";
import os from "os";

type Action = (
  message: string
) => Promise<string[]> | string[] | Promise<string> | string;

const commands: {
  match: RegExp;
  action: Action;
}[] = [];

function s(name: string, action: Action) {
  commands.push({ match: new RegExp(`^\\/${name}`), action });
}

s("foo", () => ["bar"]);

s("uptime", () => [`process: ${process.uptime()}s`, `system: ${os.uptime()}s`]);

s("time", () => `The time is ${new Date().toLocaleTimeString()}`);

s("date", () => `The date is ${new Date().toLocaleDateString()}`);

s("reset", () => {
  clearHistory();
  return "Internal memory cleared";
});

s("beemergencies", getBeemergencies);

s("taskratchet", async () => {
  const tasks = await getPendingTasks();
  return tasks.map((t) => `${t.task} due ${t.due} or pay $${t.cents / 100}`);
});

s("roll", (message) => {
  const [, sides] = message.match(/^\/roll (\d+)$/) || [];
  const roll = Math.floor(Math.random() * Number(sides)) + 1;
  return `You rolled a ${roll}`;
});

s("memory", () => {
  const f = os.freemem();
  const t = os.totalmem();
  return `Free memory: ${f} bytes (${Math.round((f / t) * 100)}%)`;
});

s("invoice", async () => {
  await generateInvoices();
  return "Invoices generated";
});

s("selfcare", () => {
  return SELF_CARE[Math.floor(Math.random() * SELF_CARE.length)];
});

// no match / help command
s("", () => commands.map((c) => c.match.source));

export default async function getSlashCommandResponse(
  message: string
): Promise<string[] | false> {
  const m = commands.find((c) => c.match.test(message));
  if (!m) return false;
  const r = await m.action(message);
  return Array.isArray(r) ? r : [r];
}
