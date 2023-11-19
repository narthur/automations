export default function getFullUrl(req: Request, path: string): string {
  const base = new URL(req.url).origin;
  return new URL(path, base).toString();
}
