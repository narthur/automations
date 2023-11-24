import { makeExecutableSchema, mergeSchemas } from "@graphql-tools/schema";
import { graphql } from "graphql";

import toggl from "./toggl/schema";

const typeDefs = `
  type Query {
    hello: String
  }
`;

const resolvers = {
  Query: {
    hello: () => "Hello, World!",
  },
};

const base = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export const runQuery = async <T>(query: string): Promise<T> => {
  return graphql({
    schema: mergeSchemas({
      schemas: [base, toggl],
    }),
    source: query,
  }) as Promise<T>;
};
