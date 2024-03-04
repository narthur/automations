import { graphql as _graphql } from "@octokit/graphql";
import env from "src/lib/env.js";

// https://github.com/octokit/graphql.js/

export const graphql = _graphql.defaults({
  headers: {
    Authorization: `bearer ${env("GITHUB_TOKEN")}`,
  },
});
