// pnpm tsx ./scripts/gptspec.ts https://example.com/
// pnpm tsx ./scripts/gptspec.ts https://developers.track.toggl.com/docs/api/time_entries/index.html

import "dotenv/config";

import axios from "axios";
import env from "src/lib/env";
import TurndownService from "turndown";

const turndownService = new TurndownService();

function convertToMarkdown(html: string) {
  return turndownService.turndown(html);
}

async function fetchHTML(url: string) {
  const response = await axios.get<string>(url);
  return response.data;
}

async function generateOpenAPISpec(markdown: string): Promise<string> {
  const token = env("OPENAI_SECRET_KEY");

  if (!token) {
    throw new Error("OPENAI_SECRET_KEY is not set.");
  }

  const apiEndpoint = "https://api.openai.com/v1/chat/completions";
  const requestBody = {
    model: "gpt-3.5-turbo-16k",
    messages: [
      {
        role: "system",
        content: `Given the provided API documentation, generate an OpenAPI spec in YAML format. The generated OpenAPI spec should include the endpoints, methods, parameters, request/response structures, and any additional relevant information present in the documentation.`,
      },
      {
        role: "user",
        content: markdown,
      },
    ],
  };

  const response = await axios.post<{
    choices: {
      message: {
        role: string;
        content: string;
        finish_reason: string;
      };
    }[];
  }>(apiEndpoint, requestBody, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.choices[0].message.content;
}

async function main() {
  const url = process.argv[2];

  if (!url) {
    console.error("Please provide a URL as a parameter.");
    return;
  }

  const html = await fetchHTML(url);
  const markdown = convertToMarkdown(html);
  const result = await generateOpenAPISpec(markdown);

  console.log(result);
}

await main();
