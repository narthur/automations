import { BaserowSdk } from "baserow-sdk";
import env from "src/lib/env";

const token = env("BASEROW_DATABASE_TOKEN");

if (!token) {
  throw new Error("BASEROW_DATABASE_TOKEN is not set");
}

const baserow = new BaserowSdk(token);

export default baserow;
