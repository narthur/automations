export const MAX_SMS_LENGTH = 320;

export default function splitMessages(input: string): string[] {
  const r = new RegExp(`([\\s\\S]{1,${MAX_SMS_LENGTH}})`, "g");
  const a = input.match(r) || [];
  if (a.length < 2) return a;
  return a.map((m, i) => `${i + 1}/${a.length}\n${m}`);
}
