import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "./src/services/**/*.graphql",
  generates: {
    "./src/services/": {
      preset: "graphql-modules",
      presetConfig: {
        baseTypesPath: "../__generated__/graphql.ts",
        filename: "__generated__/schema.ts",
        useGraphQLModules: false,
      },
      plugins: ["typescript", "typescript-resolvers"],
      config: {
        useTypeImports: true,
        avoidOptionals: true,
      },
    },
  },
};
export default config;
