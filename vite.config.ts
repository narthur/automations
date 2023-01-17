/// <reference types="vitest" />
import { defineConfig } from "vite";

export default defineConfig({
  test: {
    root: __dirname,
    setupFiles: ["./vitest.setup.ts"],
    clearMocks: true,
  },
});
