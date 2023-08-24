import { getPendingTasks } from "../services/taskratchet";
import getBeemergencies from "./getBeemergencies";

export default async function getSlashCommandResponse(
  message: string
): Promise<string[] | false> {
  if (message === "/foo") {
    return ["bar"];
  }

  if (message === "/time") {
    return [`The time is ${new Date().toLocaleTimeString()}`];
  }

  if (message === "/beemergencies") {
    return [await getBeemergencies()];
  }

  if (message === "/taskratchet pending") {
    const tasks = await getPendingTasks();
    return tasks.map((t) => `${t.task} due ${t.due} or pay $${t.cents / 100}`);
  }

  return false;
}
