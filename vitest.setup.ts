import createDatapoint from "src/services/beeminder/createDatapoint.js";
import getGoals from "src/services/beeminder/getGoals.js";
import { getDocument, getFiles } from "src/services/dynalist/index.js";
import { sendEmail } from "src/services/mailgun.js";
import { beforeEach, vi } from "vitest";

import { getPendingTasks, getTasks } from "./src/services/taskratchet.js";
import { deleteMessage, setWebhook } from "./src/services/telegram/index.js";

vi.mock("./src/lib/env");
vi.mock("./src/services/baserow/listRows");
vi.mock("./src/services/beeminder");
vi.mock("./src/services/beeminder/createDatapoint");
vi.mock("./src/services/beeminder/getBeemergencies");
vi.mock("./src/services/beeminder/getDatapoints");
vi.mock("./src/services/beeminder/getGoal");
vi.mock("./src/services/beeminder/getGoals");
vi.mock("./src/services/beeminder/refreshGoal");
vi.mock("./src/services/dynalist");
vi.mock("./src/services/mailgun");
vi.mock("./src/services/notion");
vi.mock("./src/services/openai");
vi.mock("./src/services/taskratchet");
vi.mock("./src/services/telegram");
vi.mock("axios");

beforeEach(() => {
  vi.mocked(deleteMessage).mockResolvedValue({});
  vi.mocked(getPendingTasks).mockResolvedValue([]);
  vi.mocked(setWebhook).mockResolvedValue({});
  vi.mocked(createDatapoint).mockResolvedValue(undefined);
  vi.mocked(sendEmail).mockResolvedValue({} as any);
  vi.mocked(getGoals).mockResolvedValue([]);
  vi.mocked(getTasks).mockResolvedValue([]);
  vi.mocked(getFiles).mockResolvedValue({
    files: [],
  } as any);
  vi.mocked(getDocument).mockResolvedValue({
    nodes: [],
  } as any);
});
