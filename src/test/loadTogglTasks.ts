import { vi } from "vitest";
import { TogglTask } from "../types/toggl";
import { getTasks } from "../services/toggl";

export default function loadTogglTasks(tasks: Partial<TogglTask>[]) {
  const data = tasks.map(
    (t): TogglTask => ({
      active: true,
      at: "2021-08-10T17:50:07+00:00",
      estimated_seconds: 0,
      id: 123,
      name: "task_name",
      project_id: 123,
      recurring: false,
      tracked_seconds: 0,
      workspace_id: 123,
      ...t,
    })
  );

  vi.mocked(getTasks).mockResolvedValue(data);
}