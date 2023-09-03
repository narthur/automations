import { getPendingTasks } from "../services/taskratchet.js";
import getBeemergencies from "./getBeemergencies.js";

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

  if (message.match(/^\/roll (\d+)$/)) {
    const [, sides] = message.match(/^\/roll (\d+)$/) || [];
    const roll = Math.floor(Math.random() * Number(sides)) + 1;
    return [`You rolled a ${roll}`];
  }

  return false;
}
