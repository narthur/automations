import cmd, { type Command } from "../lib/cmd.js";

const command: Command = cmd("report", async () => {
  return Promise.resolve("PPD report not implemented");
});

export default command;
