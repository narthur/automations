import os from "os";

import cmd from "../lib/cmd.js";

export default cmd("uptime", () => [
  `process: ${process.uptime()}s`,
  `system: ${os.uptime()}s`,
]);
