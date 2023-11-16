import { BM_AUTHS } from "src/secrets.js";

function parse(auth: string): [string, string] {
  const [u, t] = auth.split(":");
  if (!u || !t) {
    throw new Error(`Invalid auth: ${auth}`);
  }
  return [u, t];
}

export default function getAuths(): Record<string, string> {
  const rawAuths = BM_AUTHS.value();
  const entries = rawAuths.split(",").map(parse);

  return Object.fromEntries(entries);
}
