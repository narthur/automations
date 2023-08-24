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

  return false;
}
