import { vi } from "vitest";

const functions = {
  runWith: vi.fn().mockReturnThis(),
  pubsub: {
    schedule: vi.fn().mockReturnThis(),
    onRun: vi.fn((v: unknown) => v),
  },
  https: {
    onRequest: vi.fn((v: unknown) => v),
  },
};

module.exports = functions;
