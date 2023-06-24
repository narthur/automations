export const MAX_MESSAGE_LENGTH = 4000;

export default function splitMessages(input: string): string[] {
  const r = new RegExp(`([\\s\\S]{1,${MAX_MESSAGE_LENGTH}})`, "g");
  return input.match(r) || [];
}
