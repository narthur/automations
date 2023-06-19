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

const FUNCTIONS: {
  name: string;
  fn: () => Promise<string>;
  description?: string;
  parameters?: Record<string, unknown>;
}[] = [
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
    try {
      console.info("calling function", response.function_call?.name);
      const fn = FUNCTIONS.find((f) => f.name === response.function_call?.name);
      if (!fn) return "Unknown function";
      return fn.fn();
    } catch (e) {
      console.error(e);
      return "Error calling function";
    }
  }
  return response.content || "";
}

export default async function getSmsResponse(
  prompt: string
): Promise<string[]> {
  console.info("getting openai response");
  const raw = await getResponse(
    prompt,
    FUNCTIONS.map((f) => ({
      name: f.name,
      description: f.description,
      parameters: f.parameters,
    }))
  );
  if (!raw) {
    console.error("no response from openai");
    return [];
  }
  console.info("parsing openai response");
  const content = await getContent(raw);
  const messages =
    content.match(new RegExp(`(.{1,${MAX_SMS_LENGTH}})`, "g")) || [];
  if (messages.length < 2) return messages;
  return messages.map((m, i) => `${i + 1}/${messages.length}\n${m}`);
}
