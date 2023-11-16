import { type Goal } from "./goal.js";

export type GoalExtended = Goal & {
  url: string;
};
