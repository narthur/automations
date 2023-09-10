import { beforeEach, vi } from "vitest";
import {
  getClients,
  getProjects,
  getTimeEntries,
} from "./src/services/toggl/index.js";
import { deleteMessage, setWebhook } from "./src/services/telegram/index.js";
import { getPendingTasks } from "./src/services/taskratchet.js";
import { sendEmail } from "src/services/mailgun.js";

vi.mock("axios");
vi.mock("./src/effects/defineSecret");
vi.mock("./src/services/beeminder");
vi.mock("./src/services/mailgun");
vi.mock("./src/services/notion");
vi.mock("./src/services/openai");
vi.mock("./src/services/telegram");
vi.mock("./src/services/toggl");
vi.mock("./src/services/taskratchet");

beforeEach(() => {
  vi.mocked(getTimeEntries).mockResolvedValue([]);
  vi.mocked(getProjects).mockResolvedValue([]);
  vi.mocked(deleteMessage).mockResolvedValue({});
  vi.mocked(getPendingTasks).mockResolvedValue([]);
  vi.mocked(setWebhook).mockResolvedValue({});
  vi.mocked(sendEmail).mockResolvedValue({});
  vi.mocked(getClients).mockResolvedValue([]);
});
