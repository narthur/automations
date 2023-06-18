import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    root: __dirname,
    setupFiles: ["./vitest.setup.ts"],
    clearMocks: true,
    include: ["./src/**/*.spec.ts"],
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
