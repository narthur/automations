import { describe, expect, it } from "vitest";

import { addDocument } from "../services/notion.js";
import { getFunctionDefinitions, getFunctionResponse } from "./gptFns.js";

describe("gptFns", () => {
  it("returns function definitions", () => {
    const defs = getFunctionDefinitions();

    expect(defs).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: expect.any(String),
        }),
      ])
    );
  });

  it("calls addDocument", async () => {
    await getFunctionResponse({
      role: "assistant",
      content: null,
      function_call: {
        name: "addNotionDocument",
        arguments: JSON.stringify({
          database: "TODOS",
          title: "title",
          content: "content",
        }),
      },
      refusal: null,
    });

    expect(addDocument).toBeCalledWith(
      expect.objectContaining({
        database: "__NOTION_DATABASE_ID_TODOS_VALUE__",
      })
    );
  });
});
