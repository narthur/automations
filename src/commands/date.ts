import cmd from "./cmd.js";

export default cmd(
  "date",
  () => `The date is ${new Date().toLocaleDateString()}`
);
