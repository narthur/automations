import { SELF_CARE } from "src/constants.js";
import cmd from "./cmd.js";

export default cmd(
  "selfcare",
  () => SELF_CARE[Math.floor(Math.random() * SELF_CARE.length)]
);
