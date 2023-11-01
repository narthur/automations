import { clearHistory } from "src/lib/history.js";
import cmd from "./cmd.js";

export default cmd("reset", () => {
  clearHistory();
  return "Internal memory cleared";
});
