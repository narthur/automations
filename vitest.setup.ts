import { beforeEach, vi } from "vitest";
import { getProjects, getTimeEntries } from "./src/services/toggl";

vi.mock("axios");
vi.mock("firebase-functions/params");
vi.mock("./src/services/notion");
vi.mock("./src/services/toggl");

beforeEach(() => {
  vi.mocked(getTimeEntries).mockResolvedValue([]);
  vi.mocked(getProjects).mockResolvedValue([]);
});
