import { Goal } from "./types/goal.js";

export default function isGoal(obj: unknown): obj is Goal {
  if (typeof obj !== "object") return false;
  if (obj === null) return false;
  return typeof (obj as Goal).slug === "string";
}
