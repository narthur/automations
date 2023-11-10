import os from "os";

import cmd from "../lib/cmd.js";

export default cmd("memory", () => {
  const f = os.freemem();
  const t = os.totalmem();
  return `Free memory: ${f} bytes (${Math.round((f / t) * 100)}%)`;
});
