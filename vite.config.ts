/// <reference types="vitest" />
import { defineConfig } from "vite";
import { ViteAliases } from "vite-aliases";

export default defineConfig({
  plugins: [ViteAliases()],
  test: {
    root: __dirname,
    setupFiles: ["./vitest.setup.ts"],
  },
});
