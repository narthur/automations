import { describe, it, expect } from "vitest";
import { getFunctionDefinitions, getFunctionResponse } from "./gptFns";
import { addDocument } from "../services/notion";

describe("gptFns", () => {
  it("returns function definitions", () => {
    const defs = getFunctionDefinitions();

    // console.dir(
    //   { defs },
    //   {
    //     depth: 10,
    //   }
    // );

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
      function_call: {
        name: "addNotionDocument",
        arguments: JSON.stringify({
          database: "TODOS",
          title: "title",
          content: "content",
        }),
      },
    });
    expect(addDocument).toBeCalledWith(
      expect.objectContaining({
        database: "__SECRET_NOTION_DATABASE_ID_TODOS__",
      })
    );
  });
});
