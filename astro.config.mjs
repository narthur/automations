import node from "@astrojs/node";
import graphql from '@rollup/plugin-graphql';
import sentry from "@sentry/astro";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: node({
    mode: "middleware",
  }),
  integrations: [sentry()],
  vite: {
    plugins: [graphql()],
    build: {
      sourcemap: true,
    }
  }
});
