import { getResponse } from "../services/openai";

export const MAX_SMS_LENGTH = 320;

export default async function getSmsResponse(
  prompt: string
): Promise<string[]> {
  const raw = (await getResponse(prompt))?.content;
  if (!raw) return [];
  const messages = raw.match(new RegExp(`(.{1,${MAX_SMS_LENGTH}})`, "g")) || [];
  if (messages.length < 2) return messages;
  return messages.map((m, i) => `${i + 1}/${messages.length}\n${m}`);
}
