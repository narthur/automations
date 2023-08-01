import { beforeEach, vi } from "vitest";
import { getProjects, getTimeEntries } from "./src/services/toggl";
import { __reset } from "./src/helpers/memoize";
import { getMessages } from "./src/services/firestore";

vi.mock("axios");
vi.mock("firebase-functions/params");
vi.mock("./src/services/notion");
vi.mock("./src/services/openai");
vi.mock("./src/services/toggl");
vi.mock("./src/services/firestore");

beforeEach(() => {
  vi.mocked(getTimeEntries).mockResolvedValue([]);
  vi.mocked(getProjects).mockResolvedValue([]);
  vi.mocked(getMessages).mockResolvedValue([]);
  __reset();
});
