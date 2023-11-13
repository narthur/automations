import "./cron.ts";

import * as Sentry from "@sentry/node";
import axios, { AxiosError, AxiosResponse } from "axios";

import { app } from "./app.js";

const PORT = process.env.PORT || 3000;

// SOURCE: https://stackoverflow.com/a/73988706/937377
axios.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (
      error.response?.status === 422 &&
      JSON.stringify(error.response.data).toLowerCase().includes("duplicate")
    ) {
      console.warn("Ignoring duplicate datapoint error");
      return;
    }

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      Sentry.captureException(error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      Sentry.captureException(error.message);
    }
    Sentry.captureException(error);
    return Promise.reject(error);
  }
);

app.listen(PORT, () => console.info(`Listening at http://localhost:${PORT}`));
