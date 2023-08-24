import { beforeEach, vi } from "vitest";
import { getProjects, getTimeEntries } from "./src/services/toggl";
import { __reset } from "./src/effects/memoize";
import { getMessages, getDoc } from "./src/services/firestore";
import { deleteMessage } from "./src/services/telegram";

vi.mock("axios");
vi.mock("firebase-functions");
vi.mock("firebase-functions/params");
vi.mock("./src/services/notion");
vi.mock("./src/services/openai");
vi.mock("./src/services/telegram");
vi.mock("./src/services/toggl");
vi.mock("./src/services/firestore");

beforeEach(() => {
  vi.mocked(getTimeEntries).mockResolvedValue([]);
  vi.mocked(getProjects).mockResolvedValue([]);
  vi.mocked(getMessages).mockResolvedValue([]);
  vi.mocked(getDoc).mockResolvedValue({});
  vi.mocked(deleteMessage).mockResolvedValue({});
  __reset();
});
