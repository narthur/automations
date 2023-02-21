import { bmAuths } from "../../secrets";

function parse(auth: string): [string, string] {
  const [u, t] = auth.split(":");
  return [u, t];
}

export default function getBmToken(user: string): string | undefined {
  const rawAuths = bmAuths.value();
  const entries = rawAuths.split(",").map(parse);
  const auths = Object.fromEntries(entries);

  return auths[user];
}
