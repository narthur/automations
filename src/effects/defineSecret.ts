export default function defineSecret(name: string) {
  return {
    name,
    value: () => process.env[name] || "",
  };
}
