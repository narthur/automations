export default function getSlashCommandResponse(message: string) {
  if (message === "/foo") {
    return ["bar"];
  }

  if (message === "/time") {
    return [`The time is ${new Date().toLocaleTimeString()}`];
  }

  return false;
}
