import * as functions from "firebase-functions";
import gross_ from "./jobs/gross";

const gross = functions.https.onRequest(async (req, res) => {
  await gross_();
  res.send("job completed: gross");
});

export { gross };
