import { getGoals } from "../services/beeminder";
import { getResponse } from "../services/openai";
import { ChatCompletionResponseMessage } from "openai";

export const MAX_SMS_LENGTH = 320;

async function getBeemergencies(): Promise<string> {
  const goals = await getGoals();
  const due = goals.filter((g) => g.safebuf === 0);

  if (due.length === 0) return "No beemergencies!";

  return due.map((g) => g.slug).join("\n");
}

const FUNCTIONS = [
  {
    name: "getBeemergencies",
    fn: getBeemergencies,
    description: "Get a list of Beeminder goals which are due today.",
  },
];

async function getContent(
  response: ChatCompletionResponseMessage
): Promise<string> {
  if (response.function_call) {
    const fn = FUNCTIONS.find((f) => f.name === response.function_call?.name);
    if (!fn) return "Unknown function";
    return fn.fn();
  }
  return response.content || "";
}

export default async function getSmsResponse(
  prompt: string
): Promise<string[]> {
  const raw = await getResponse(prompt, FUNCTIONS);
  if (!raw) return [];
  const content = await getContent(raw);
  const messages =
    content.match(new RegExp(`(.{1,${MAX_SMS_LENGTH}})`, "g")) || [];
  if (messages.length < 2) return messages;
  return messages.map((m, i) => `${i + 1}/${messages.length}\n${m}`);
}
