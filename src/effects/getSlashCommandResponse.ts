import { getPendingTasks } from "../services/taskratchet.js";
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

function s(match: RegExp, action: Action) {
  commands.push({ match, action });
}

s(/^\/foo$/, () => ["bar"]);

s(/^\/uptime$/, () => [
  `process: ${process.uptime()}s`,
  `system: ${os.uptime()}s`,
]);

s(/^\/time$/, () => `The time is ${new Date().toLocaleTimeString()}`);

s(/^\/date$/, () => `The date is ${new Date().toLocaleDateString()}`);

s(/^\/reset$/, () => {
  clearHistory();
  return "Internal memory cleared";
});

s(/^\/beemergencies$/, getBeemergencies);

s(/^\/taskratchet pending$/, async () => {
  const tasks = await getPendingTasks();
  return tasks.map((t) => `${t.task} due ${t.due} or pay $${t.cents / 100}`);
});

s(/^\/roll (\d+)$/, (message) => {
  const [, sides] = message.match(/^\/roll (\d+)$/) || [];
  const roll = Math.floor(Math.random() * Number(sides)) + 1;
  return `You rolled a ${roll}`;
});

s(/^\/memory$/, () => {
  const f = os.freemem();
  const t = os.totalmem();
  return `Free memory: ${f} bytes (${Math.round((f / t) * 100)}%)`;
});

export default async function getSlashCommandResponse(
  message: string
): Promise<string[] | false> {
  const m = commands.find((c) => c.match.test(message));
  if (!m) return false;
  const r = await m.action(message);
  return Array.isArray(r) ? r : [r];
}
