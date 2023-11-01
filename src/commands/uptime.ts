import cmd from "../lib/cmd.js";
import os from "os";

export default cmd("uptime", () => [
  `process: ${process.uptime()}s`,
  `system: ${os.uptime()}s`,
]);
