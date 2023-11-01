import cmd from "../lib/cmd.js";

export default cmd(
  "today",
  () => `Today is ${new Date().toLocaleDateString()}`
);
