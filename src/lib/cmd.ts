export type Command = {
  match: RegExp;
  action: Action;
};

export type Action = (
  message: string,
  commands: Command[]
) => Promise<string[]> | string[] | Promise<string> | string;

export default function cmd(name: string, action: Action): Command {
  return { match: new RegExp(`^\\/${name}`), action };
}
