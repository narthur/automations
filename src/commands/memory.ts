import cmd from "../lib/cmd.js";
import os from "os";

export default cmd("memory", () => {
  const f = os.freemem();
  const t = os.totalmem();
  return `Free memory: ${f} bytes (${Math.round((f / t) * 100)}%)`;
});
