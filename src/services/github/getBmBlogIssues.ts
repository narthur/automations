import type { GraphQlResponse } from "node_modules/@octokit/graphql/dist-types/types.js";
import z from "zod";

import { graphql } from "./index.js";

type Issue = {
  id: string;
  title: string;
  url: string;
  createdAt: string;
  body: string;
  labels: {
    nodes: {
      id: string;
      name: string;
      description: string;
    }[];
  };
};

type ResponseType = {
  repository: {
    issues: {
      nodes: Issue[];
    };
  };
};

const schema = z.object({
  repository: z.object({
    issues: z.object({
      nodes: z.array(
        z.object({
          id: z.string(),
          title: z.string(),
          url: z.string(),
          createdAt: z.string(),
          body: z.string(),
          labels: z.object({
            nodes: z.array(
              z.object({
                id: z.string(),
                name: z.string(),
                description: z.string(),
              })
            ),
          }),
        })
      ),
    }),
  }),
});

export default async function getBmBlogIssues(): GraphQlResponse<ResponseType> {
  const result = await graphql(`
    {
      repository(owner: "beeminder", name: "blog") {
        issues(
          labels: ["DEV"]
          states: OPEN
          orderBy: { field: CREATED_AT, direction: DESC }
          first: 100
        ) {
          nodes {
            id
            title
            url
            createdAt
            body
            labels(first: 100) {
              nodes {
                id
                name
                description
              }
            }
          }
        }
      }
    }
  `);

  try {
    return schema.parse(result);
  } catch (e) {
    console.dir(result, { depth: null });
    throw e;
  }
}
