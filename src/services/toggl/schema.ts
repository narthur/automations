import { makeExecutableSchema } from "@graphql-tools/schema";
import { type IResolvers } from "@graphql-tools/utils";

import { TogglModule } from "./__generated__/schema";
import togglTimeEntries from "./resolvers/entries";
import togglMe from "./resolvers/me";
import typeDefs from "./schema.graphql";

const resolvers: TogglModule.Resolvers & IResolvers = {
  Query: {
    togglTimeEntries,
    togglMe,
  },
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export default schema;
