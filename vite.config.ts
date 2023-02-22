import { defineConfig } from "vitest/config";
import { ViteAliases } from "vite-aliases";

export default defineConfig({
  plugins: [
    ViteAliases({
      useConfig: true,
      useTypescript: true,
    }),
  ],
  test: {
    root: __dirname,
    setupFiles: ["./vitest.setup.ts"],
    clearMocks: true,
    include: ["./src/**/*.spec.ts"],
  },
});
