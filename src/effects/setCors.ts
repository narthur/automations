import * as functions from "firebase-functions";

export default function setCors(res: functions.Response) {
  res.set("Access-Control-Allow-Origin", "*");
}
