import { beforeEach, vi } from "vitest";
import { getProjects, getTimeEntries } from "./src/lib/toggl";

vi.mock("axios");
vi.mock("./src/lib/toggl");
vi.mock("firebase-functions/params");
vi.mock("./src/secrets.ts");

beforeEach(() => {
  vi.mocked(getTimeEntries).mockResolvedValue([]);
  vi.mocked(getProjects).mockResolvedValue([]);
});
