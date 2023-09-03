import express from "express";

export default function setCors(res: express.Response) {
  res.set("Access-Control-Allow-Origin", "*");
}
