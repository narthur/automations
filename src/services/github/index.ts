import { graphql as _graphql } from "@octokit/graphql";
import env from "src/lib/env.js";

// https://github.com/octokit/graphql.js/

_graphql.defaults({
  Authorization: `bearer ${env("GITHUB_TOKEN")}`,
});

export const graphql = _graphql;
