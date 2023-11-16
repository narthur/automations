import beemergencies from "../commands/beemergencies.js";
import beetuning from "../commands/beetuning.js";
import date from "../commands/date.js";
import foo from "../commands/foo.js";
import help from "../commands/help.js";
import invoice from "../commands/invoice.js";
import memory from "../commands/memory.js";
import reset from "../commands/reset.js";
import roll from "../commands/roll.js";
import selfcare from "../commands/selfcare.js";
import taskratchet from "../commands/taskratchet.js";
import time from "../commands/time.js";
import today from "../commands/today.js";
import uptime from "../commands/uptime.js";
import { type Command } from "./cmd.js";

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
  today,
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
