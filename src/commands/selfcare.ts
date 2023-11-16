import { SELF_CARE } from "src/constants.js";

import cmd from "../lib/cmd.js";

export default cmd(
  "selfcare",
  () =>
    SELF_CARE[Math.floor(Math.random() * SELF_CARE.length)] ||
    "No self-care ideas found."
);
