import { beforeEach } from "vitest";

export const PROJECTS = [
  {
    id: 0,
    rate: 10,
    label: "Project 0",
  },
  {
    id: 1,
    rate: 20,
    label: "Project 1",
  },
];

export const setEnv = (env: Record<string, string>) => {
  process.env = {
    ...process.env,
    GROSS_TOGGL_LABELS: PROJECTS.map((p) => p.label).join(","),
    GROSS_TOGGL_PROJECTS: PROJECTS.map((p) => p.id).join(","),
    GROSS_TOGGL_RATES: PROJECTS.map((p) => p.rate).join(","),
    TOGGL_API_TOKEN: "the_token",
    BM_AUTHS: "narthur:the_auth_token",
    ...env,
  };
};

beforeEach(() => {
  setEnv({});
});
