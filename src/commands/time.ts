import cmd from "./cmd.js";

export default cmd(
  "time",
  () => `The time is ${new Date().toLocaleTimeString()}`
);
