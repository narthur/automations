import { resetThread } from "src/services/openai/getThread.js";

import cmd from "../lib/cmd.js";

export default cmd("reset", async () => {
  await resetThread();
  return "Conversation reset";
});
