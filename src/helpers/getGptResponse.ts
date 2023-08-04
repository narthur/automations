import { getResponse } from "../services/openai";
import {
  ChatCompletionRequestMessageRoleEnum,
  ChatCompletionResponseMessage,
} from "openai";
import splitMessages from "./splitMessages";
import { addMessage, getMessages } from "../services/firestore";
import getBeemergencies from "./getBeemergencies";

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
    const name = response.function_call?.name;
    try {
      console.info("calling function", name);
      const fn = FUNCTIONS.find((f) => f.name === name);
      if (!fn) return `Unknown function ${String(name)}`;
      return fn.fn();
    } catch (e) {
      console.error(e);
      return `Error calling function ${String(name)}`;
    }
  }
  return response.content || "";
}

export default async function getGptResponse(
  prompt: string
): Promise<string[]> {
  console.info("getting openai response");
  const history = await getMessages();
  const messages = [
    {
      role: ChatCompletionRequestMessageRoleEnum.System,
      content:
        "Your user is a developer. If they ask you to do something beyond your capabilities, you should request that they add a function to the system for you to use. Describe the function you need in as much detail as possible.",
    },
    ...history.map((m) => {
      if (m.message.role === ChatCompletionRequestMessageRoleEnum.Function) {
        return {
          role: ChatCompletionRequestMessageRoleEnum.Function,
          name: m.message.name,
          function_call: m.message.function_call,
        };
      }

      return m.message;
    }),
    {
      role: ChatCompletionRequestMessageRoleEnum.User,
      content: prompt,
    },
  ];
  await addMessage({
    role: ChatCompletionRequestMessageRoleEnum.User,
    content: prompt,
  });
  const raw = await getResponse(
    messages,
    FUNCTIONS.map((f) => ({
      name: f.name,
      description: f.description,
      parameters: f.parameters,
    }))
  );
  if (!raw) {
    throw new Error("no response from openai");
  }
  console.info("parsing openai response");
  const content = await getContent(raw);
  const isFunction = !!raw.function_call?.name?.length;
  await addMessage(
    isFunction
      ? {
          role: ChatCompletionRequestMessageRoleEnum.Function,
          name: raw.function_call?.name,
          content,
          function_call: raw.function_call,
        }
      : {
          role: ChatCompletionRequestMessageRoleEnum.Assistant,
          content,
        }
  );
  return splitMessages(content);
}
