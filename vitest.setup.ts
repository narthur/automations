import { beforeEach, vi } from "vitest";
import {
  getClients,
  getMe,
  getProjects,
  getTimeEntries,
} from "./src/services/toggl/index.js";
import { deleteMessage, setWebhook } from "./src/services/telegram/index.js";
import { getPendingTasks } from "./src/services/taskratchet.js";
import { sendEmail } from "src/services/mailgun.js";
import { getDocument, getFiles } from "src/services/dynalist/index.js";
import getTimeSummary from "src/services/toggl/getTimeSummary.js";
import getGoals from "src/services/beeminder/getGoals.js";
import searchTimeEntries from "src/services/toggl/searchTimeEntries.js";

vi.mock("axios");
vi.mock("./src/lib/defineSecret");
vi.mock("./src/services/beeminder");
vi.mock("./src/services/beeminder/createDatapoint");
vi.mock("./src/services/beeminder/getGoals");
vi.mock("./src/services/beeminder/getGoal");
vi.mock("./src/services/beeminder/getBeemergencies");
vi.mock("./src/services/dynalist");
vi.mock("./src/services/mailgun");
vi.mock("./src/services/notion");
vi.mock("./src/services/openai");
vi.mock("./src/services/telegram");
vi.mock("./src/services/toggl");
vi.mock("./src/services/toggl/getTimeSummary");
vi.mock("./src/services/toggl/searchTimeEntries");
vi.mock("./src/services/taskratchet");

beforeEach(() => {
  vi.mocked(getTimeEntries).mockResolvedValue([]);
  vi.mocked(getProjects).mockResolvedValue([]);
  vi.mocked(deleteMessage).mockResolvedValue({});
  vi.mocked(getPendingTasks).mockResolvedValue([]);
  vi.mocked(setWebhook).mockResolvedValue({});
  vi.mocked(sendEmail).mockResolvedValue({} as any);
  vi.mocked(getClients).mockResolvedValue([]);
  vi.mocked(getGoals).mockResolvedValue([]);
  vi.mocked(getFiles).mockResolvedValue({
    files: [],
  } as any);
  vi.mocked(getDocument).mockResolvedValue({
    nodes: [],
  } as any);
  vi.mocked(getMe).mockResolvedValue({
    default_workspace_id: 1,
  } as any);
  vi.mocked(getTimeSummary).mockResolvedValue({
    groups: [],
  });
  vi.mocked(searchTimeEntries).mockResolvedValue({
    groups: [],
  });
});
