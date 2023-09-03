import express from "express";

export default function getFullUrl(req: express.Request, path: string) {
  return `https://${String(req.header("host"))}/${path}`;
}
