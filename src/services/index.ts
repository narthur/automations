import { makeExecutableSchema } from "@graphql-tools/schema";
import { graphql } from "graphql";

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

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export const runQuery = async (query: string) => {
  return graphql({
    schema,
    source: query,
  });
};
