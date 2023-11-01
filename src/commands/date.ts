import cmd from "../lib/cmd.js";

export default cmd(
  "date",
  () => `The date is ${new Date().toLocaleDateString()}`
);
