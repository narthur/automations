import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    root: __dirname,
    setupFiles: ["./vitest.setup.ts"],
    clearMocks: true,
    exclude: ["./lib/**"],
  },
});
