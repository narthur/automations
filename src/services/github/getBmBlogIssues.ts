import { graphql } from "./index.js";
import type { GraphQlResponse } from "@octokit/graphql/dist-types/types.d.ts";

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
  data: {
    repository: {
      issues: {
        nodes: Issue[];
      };
    };
  };
};

export default function getBmBlogIssues(): GraphQlResponse<ResponseType> {
  return graphql(`
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
}
