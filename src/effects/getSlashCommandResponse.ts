import { getPendingTasks } from "../services/taskratchet.js";
import getBeemergencies from "./getBeemergencies.js";
import { clearHistory } from "./history.js";
import os from "os";

const commands: {
  match: RegExp;
  action: (message: string) => Promise<string[]> | string[];
}[] = [];

function s(
  match: RegExp,
  action: (message: string) => Promise<string[]> | string[]
) {
  commands.push({ match, action });
}

s(/^\/foo$/, () => ["bar"]);

s(/^\/uptime$/, () => [
  `process: ${process.uptime()}s`,
  `system: ${os.uptime()}s`,
]);

s(/^\/time$/, () => [`The time is ${new Date().toLocaleTimeString()}`]);

s(/^\/date$/, () => [`The date is ${new Date().toLocaleDateString()}`]);

s(/^\/reset$/, () => {
  clearHistory();
  return ["Internal memory cleared"];
});

s(/^\/beemergencies$/, async () => [await getBeemergencies()]);

s(/^\/taskratchet pending$/, async () => {
  const tasks = await getPendingTasks();
  return tasks.map((t) => `${t.task} due ${t.due} or pay $${t.cents / 100}`);
});

s(/^\/roll (\d+)$/, (message) => {
  const [, sides] = message.match(/^\/roll (\d+)$/) || [];
  const roll = Math.floor(Math.random() * Number(sides)) + 1;
  return [`You rolled a ${roll}`];
});

export default async function getSlashCommandResponse(
  message: string
): Promise<string[] | false> {
  const m = commands.find((c) => c.match.test(message));

  return m ? m.action(message) : false;
}
