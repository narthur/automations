import { beforeEach, vi } from "vitest";
import { getProjects, getTimeEntries } from "./src/services/toggl";

vi.mock("axios");
vi.mock("./src/services/toggl");
vi.mock("firebase-functions/params");
vi.mock("./src/secrets.ts");

beforeEach(() => {
  vi.mocked(getTimeEntries).mockResolvedValue([]);
  vi.mocked(getProjects).mockResolvedValue([]);
});
