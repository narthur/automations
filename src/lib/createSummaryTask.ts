import { createTask, getTasks } from "src/services/taskratchet.js";
import { getProject } from "src/services/toggl/getProject.js";

export default async function createSummaryTask(event: {
  payload: {
    id: number;
    description: string;
    workspace_id: number;
    project_id: number;
    stop: string | null;
  };
}) {
  const { description, id, stop, workspace_id, project_id } = event.payload;

  if (stop === null || description === "Summary") {
    return;
  }

  const kv = `#togglId=${id}`;
  const tasks = await getTasks().then((r) => r.data);
  const r = new RegExp(`${kv}$`);
  const match = tasks.find((t) => r.test(t.task));

  if (match) {
    return;
  }

  const project = await getProject(workspace_id, project_id);
  const due = new Date(stop);

  if (description) {
    due.setHours(due.getHours() + 1);
  } else {
    due.setMinutes(due.getMinutes() + 30);
  }

  const formattedDeadline = due.toLocaleString("en-US", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  await createTask(
    `Log summary for Toggl entry: ${
      description || "[no description]"
    } #project="${project.name}" ${kv}`,
    formattedDeadline,
    100
  );
}
