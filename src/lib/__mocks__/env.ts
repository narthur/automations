import { vi } from "vitest";

const env = vi.fn((k: string) => `__${k}_VALUE__`);

export default env;
