import * as functions from "firebase-functions";
import gross_ from "./jobs/gross";

const gross = functions.https.onRequest(gross_);

export { gross };
