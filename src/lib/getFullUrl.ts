export default function getFullUrl(req: Request, path: string): string {
  return `https://${String(req.headers.get("host"))}/${path}`;
}
