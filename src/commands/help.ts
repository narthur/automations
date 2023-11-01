import cmd from "../lib/cmd.js";

// no match / help command
export default cmd("", (_, commands) => commands.map((c) => c.match.source));
