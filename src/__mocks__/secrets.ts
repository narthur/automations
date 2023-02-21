import { vi } from "vitest";

export const bmAuths = {
  value: vi.fn(() => "narthur:the_auth_token"),
};

export const mailgunApiKey = {
  value: vi.fn(() => "the_key"),
};

export const mailgunDomain = {
  value: vi.fn(() => "the_domain"),
};

export const togglApiToken = {
  value: vi.fn(() => "the_token"),
};
