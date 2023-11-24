import graphql from "@rollup/plugin-graphql";
import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [graphql()],
  test: {
    root: __dirname,
    globalSetup: "./vitest.global.ts",
    setupFiles: ["./vitest.setup.ts"],
    clearMocks: true,
    include: ["./src/**/*.spec.ts"],
    server: {
      deps: {
        // WORKAROUND: https://github.com/graphql/graphql-js/issues/2801#issuecomment-1758428498
        fallbackCJS: true,
      },
    },
  },
  resolve: {
    alias: [
      {
        find: /^src\//,
        replacement: path.resolve(__dirname, "./src") + path.sep,
      },
    ],
  },
});
