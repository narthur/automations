import { bmAuths } from "../../secrets";

export default function getBmToken(user: string): string | undefined {
  const auths = bmAuths
    .value()
    .split(",")
    .reduce((acc, auth) => {
      const [user, pass] = auth.split(":");
      acc[user] = pass;
      return acc;
    }, {} as Record<string, string>);

  return auths[user];
}
