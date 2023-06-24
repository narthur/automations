import { getGoals } from "../services/beeminder";
import { getResponse } from "../services/openai";
import { ChatCompletionResponseMessage } from "openai";
import splitMessages from "./splitMessages";

async function getBeemergencies(): Promise<string> {
  const goals = await getGoals();
  const due = goals.filter((g) => g.safebuf === 0);

  if (due.length === 0) return "No beemergencies!";

  const len = due.reduce((acc, g) => Math.max(acc, g.slug.length + 1), 0);

  return due.map((g) => `${g.slug.padEnd(len, " ")}${g.limsum}`).join("\n");
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
    parameters: {
      type: "object",
      properties: {},
      required: [],
    },
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

export default async function getGptResponse(
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
  return splitMessages(content);
}
