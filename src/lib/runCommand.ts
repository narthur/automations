import ppdReport from "src/commands/ppdReport.js";

import alarm from "../commands/alarm.js";
import beemergencies from "../commands/beemergencies.js";
import beetuning from "../commands/beetuning.js";
import date from "../commands/date.js";
import foo from "../commands/foo.js";
import help from "../commands/help.js";
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
  alarm,
  beemergencies,
  beetuning,
  date,
  foo,
  help,
  memory,
  ppdReport,
  reset,
  roll,
  selfcare,
  taskratchet,
  time,
  today,
  uptime,
];

export default async function runCommand(
  message: string
): Promise<string[] | false> {
  const m = commands
    .sort((a, b) => b.match.toString().length - a.match.toString().length)
    .find((c) => c.match.test(message));
  if (!m) return false;
  const r = await m.action(message, commands);
  return [r].flat();
}
