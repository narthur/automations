import { beforeEach, vi } from "vitest";
import { getProjects, getTimeEntries } from "./src/lib/toggl";
import { defineSecret } from "firebase-functions/params";
import { SecretParam } from "firebase-functions/lib/params/types";

vi.mock("axios");
vi.mock("./src/lib/toggl");
vi.mock("firebase-functions/params");

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
  env = {
    GROSS_TOGGL_LABELS: PROJECTS.map((p) => p.label).join(","),
    GROSS_TOGGL_PROJECTS: PROJECTS.map((p) => p.id).join(","),
    GROSS_TOGGL_RATES: PROJECTS.map((p) => p.rate).join(","),
    TOGGL_API_TOKEN: "the_token",
    BM_AUTHS: "narthur:the_auth_token",
    ...env,
  };

  vi.mocked(defineSecret).mockImplementation(
    (name: string) =>
      ({
        value: () => env[name] || "",
      } as SecretParam)
  );
};

setEnv({});

beforeEach(() => {
  setEnv({});
  vi.mocked(getTimeEntries).mockResolvedValue([]);
  vi.mocked(getProjects).mockResolvedValue([]);
});
