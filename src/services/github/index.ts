import { graphql as _graphql } from "@octokit/graphql";
import { GITHUB_TOKEN } from "src/secrets.js";

// https://github.com/octokit/graphql.js/

_graphql.defaults({
  authorization: `token ${GITHUB_TOKEN.value()}`,
});

export const graphql = _graphql;
