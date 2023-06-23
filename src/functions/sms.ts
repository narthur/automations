import * as functions from "firebase-functions";
import {
  bmAuths,
  twilioAuthToken,
  twilioWhitelistedNumbers,
  openAiSecretKey,
  twilioAccountSid,
  twilioPhoneNumber,
} from "../secrets";
import { isRequestAuthorized, sendMessages } from "../services/twilio";
import getGptResponse from "../helpers/getGptResponse";

export const sms_https = functions
  .runWith({
    secrets: [
      twilioAccountSid.name,
      twilioAuthToken.name,
      twilioPhoneNumber.name,
      twilioWhitelistedNumbers.name,
      openAiSecretKey.name,
      bmAuths.name,
    ],
  })
  .https.onRequest(async (req, res) => {
    console.info("Validating Twilio request");

    if (!isRequestAuthorized(req)) {
      console.error("Unauthorized");
      res.status(401).send("Unauthorized");
      return;
    }

    console.info("Twilio request is authorized");

    console.log(req.body);

    const params = req.body as Record<string, unknown>;
    const messages = await getGptResponse(params.Body as string);

    console.info("Sending messages");

    await sendMessages(params.From as string, messages);

    res.sendStatus(200);
  });
