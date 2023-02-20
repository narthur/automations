import * as functions from "firebase-functions";
import gross_ from "./jobs/gross";

const gross = functions.https.onRequest(async () => {
  console.log("gross start");
  await gross_();
  console.log("gross end");
});

export { gross };
