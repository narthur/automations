import getBeemergencies from "./getBeemergencies";
import { ChatCompletion, CompletionCreateParams } from "openai/resources/chat";
import { addDocument } from "../services/notion";
import z from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { DATABASES } from "../services/notion.helpers";

type Fn = z.ZodEffects<z.ZodType<unknown, z.ZodTypeDef, unknown>, string>;

const FUNCTIONS: Record<string, Fn> = {
  getBeemergencies: z
    .object({})
    .describe("Get a list of Beeminder goals which are due today.")
    .transform(getBeemergencies),
  addNotionDocument: z
    .object({
      database: DATABASES,
      title: z.string(),
      content: z.string(),
    })
    .describe("Add a document to Notion")
    .transform(async (args) => {
      await addDocument(args);
      return "Document added";
    }),
};

export async function getFunctionResponse(
  response: ChatCompletion.Choice.Message
): Promise<string | false> {
  const { name, arguments: args = "{}" } = response.function_call || {};
  if (!name) return false;
  try {
    console.info("calling function", name);
    if (!(name in FUNCTIONS)) throw new Error(`Function ${name} not found`);
    return FUNCTIONS[name].parseAsync(JSON.parse(args));
  } catch (e) {
    console.error(e);
    return `Error calling function ${String(name)}`;
  }
}

export function getFunctionDefinitions(): CompletionCreateParams.Function[] {
  return Object.entries(FUNCTIONS).map(([name, fn]) => ({
    name,
    description: fn._def.description,
    parameters: zodToJsonSchema(fn._def.schema),
  }));
}
