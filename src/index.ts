import { app } from "./app.js";
import "./cron.ts";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
});
