export default function getBmToken(user: string) {
  const auths = process.env.BM_AUTHS.split(",").reduce((acc, auth) => {
    const [user, pass] = auth.split(":");
    acc[user] = pass;
    return acc;
  }, {} as Record<string, string>);

  return auths[user];
}
