import { Command } from "./cmd.js";
import foo from "./foo.js";
import uptime from "./uptime.js";
import time from "./time.js";
import date from "./date.js";
import reset from "./reset.js";
import beemergencies from "./beemergencies.js";
import beetuning from "./beetuning.js";
import taskratchet from "./taskratchet.js";
import roll from "./roll.js";
import memory from "./memory.js";
import invoice from "./invoice.js";
import selfcare from "./selfcare.js";
import help from "./help.js";

const commands: Command[] = [
  foo,
  uptime,
  time,
  date,
  reset,
  beemergencies,
  beetuning,
  taskratchet,
  roll,
  memory,
  invoice,
  selfcare,
  help,
];

export default async function runCommand(
  message: string
): Promise<string[] | false> {
  const m = commands.find((c) => c.match.test(message));
  if (!m) return false;
  const r = await m.action(message, commands);
  return [r].flat();
}
